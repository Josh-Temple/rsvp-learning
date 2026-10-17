import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

// This test measures real Chromium CSS metrics. It does NOT prove authenticated
// web access, Android hardware behavior, or audible Web Speech output.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paths = [
  "learn/security-authentication-access-control.html",
  "drafts/security-course-v/learn/security-secure-by-design-default.html",
  "drafts/security-course-v/learn/security-input-output-injection.html"
];
const browsers = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].filter(Boolean);
let browser;
for (const name of browsers) {
  try { execFileSync(name, ["--version"], { stdio: "ignore" }); browser = name; break; } catch {}
}
assert.ok(browser, "Chrome/Chromium executable unavailable: cannot claim 390px PASS");

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/^\//, "");
    const filename = path.resolve(root, pathname);
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const data = await fs.readFile(filename);
    res.writeHead(200, { "content-type": filename.endsWith(".css") ? "text/css" : filename.endsWith(".js") ? "text/javascript" : "text/html; charset=utf-8" });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "rsvp-mobile-qa-"));
const profile = path.join(tmpDir, "chrome-profile");
await fs.mkdir(profile);
const proc = spawn(browser, [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--no-first-run", "--no-default-browser-check", "--remote-allow-origins=*",
  "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"
], { stdio: ["ignore", "ignore", "pipe"] });
proc.stderr.on("data", () => {});
let ws;
let seq = 0;
const pending = new Map();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq;
  const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 20000);
  pending.set(id, { resolve, reject, timer });
  ws.send(JSON.stringify({ id, method, params }));
});
async function waitForPort() {
  for (let i = 0; i < 70; ++i) {
    try {
      const text = await fs.readFile(path.join(profile, "DevToolsActivePort"), "utf8");
      return Number(text.split("\n")[0]);
    } catch { if (proc.exitCode !== null) throw Error("Chromium exited before CDP initialization"); await pause(100); }
  }
  throw Error("CDP port not available");
}
async function openPage(port) {
  const r = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  assert.equal(r.ok, true, `CDP create page HTTP ${r.status}`);
  const v = await r.json();
  ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
  ws.addEventListener("message", ({ data }) => {
    const msg = JSON.parse(String(data));
    if (!msg.id) return;
    const p = pending.get(msg.id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(msg.id);
    msg.error ? p.reject(Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
  });
}
async function evalJs(expression) {
  const v = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (v.exceptionDetails) throw Error(JSON.stringify(v.exceptionDetails));
  return v.result.value;
}
const sample = `(() => {
  const buttons = [...document.querySelectorAll("button, select, input, a")].filter(el => {
    const rect = el.getBoundingClientRect(), css = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && css.display !== "none" && css.visibility !== "hidden";
  });
  const overlapping = [];
  for (let i = 0; i < buttons.length; i++) for (let j = i + 1; j < buttons.length; j++) {
    const a = buttons[i].getBoundingClientRect(), b = buttons[j].getBoundingClientRect();
    const overlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    if (overlap >= 16) overlapping.push([i, j]);
  }
  const play = document.querySelector("#speech-play");
  const rect = play?.getBoundingClientRect();
  return {
    ready: document.readyState,
    innerWidth: innerWidth, clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth,
    controlCount: buttons.length, controlOverlaps: overlapping,
    playRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
    jsLoadStatus: !!document.querySelector("#speech-status")?.textContent
  };
})()`;
let exitCode = 1;
try {
  const port = await waitForPort();
  await openPage(port);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  const results = [];
  for (const rel of paths) {
    const filename = path.join(root, rel);
    try { await fs.access(filename); } catch {
      if (!rel.startsWith("drafts/security-course-v/")) throw Error(`required HTML missing: ${rel}`);
      const candidateSha = "2ceb3bae83dca17f00dcfb84cddfd726c20c92a0";
      const html = execFileSync("git", ["show", `${candidateSha}:${rel}`], { cwd: root });
      await fs.mkdir(path.dirname(filename), { recursive: true });
      await fs.writeFile(filename, html);
    }
    const nav = await send("Page.navigate", { url: `${baseUrl}/${rel}` });
    if (nav.errorText) throw Error(`${rel}: navigation failed: ${nav.errorText}`);
    for (let t = 0; t < 30; ++t) {
      await pause(150);
      const r = await evalJs(`document.readyState === "complete" && !!document.querySelector("#speech-play")`);
      if (r) break;
    }
    const metrics = await evalJs(sample);
    const touchSetup = await evalJs(`(() => {
      const btn = document.querySelector("#speech-play");
      if (!btn) return null;
      window.__qaTouchClickCount = 0;
      btn.addEventListener("click", () => { window.__qaTouchClickCount++; });
      const r = btn.getBoundingClientRect();
      return { x: Math.max(1, r.x + r.width / 2), y: Math.max(1, r.y + r.height / 2) };
    })()`);
    if (!touchSetup) throw Error(`${rel}: speech play button not present for tap`);
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{x:touchSetup.x, y:touchSetup.y}] });
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await pause(200);
    const touchClickCount = await evalJs("window.__qaTouchClickCount");
    const row = { path: rel, ...metrics, touchClickCount };
    results.push(row);
    assert.equal(row.innerWidth, 390, `${rel}: not real 390 CSS px`);
    assert.equal(row.clientWidth, 390, `${rel}: document viewport mismatch`);
    assert.ok(row.scrollWidth <= 390 && row.bodyScrollWidth <= 390, `${rel}: horizontal overflow ${row.scrollWidth}/${row.bodyScrollWidth}`);
    assert.deepEqual(row.controlOverlaps, [], `${rel}: overlapping controls`);
    assert.ok(row.controlCount >= 4 && row.playRect, `${rel}: reader controls not rendered`);
    assert.ok(row.jsLoadStatus, `${rel}: reader JS status was not initialized`);
    assert.ok(touchClickCount >= 1, `${rel}: touch event did not activate reader control`);
  }
  const report = { verdict: "STATIC_CHROMIUM_390_CSS_PX_PASS", caveat: "not authenticated, not real Android, not audible speech", chromium: browser, candidate_sha: "2ceb3bae83dca17f00dcfb84cddfd726c20c92a0", results };
  if (process.env.QA_REPORT_PATH) {
    await fs.mkdir(path.dirname(process.env.QA_REPORT_PATH), { recursive: true });
    await fs.writeFile(process.env.QA_REPORT_PATH, JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify(report, null, 2));
  exitCode = 0;
} catch (error) {
  console.error("390px browser QA FAIL/UNVERIFIED:", String(error));
} finally {
  ws?.close();
  proc.kill("SIGTERM");
  server.close();
  await pause(350); await fs.rm(tmpDir, { recursive: true, force: true, maxRetries: 7, retryDelay: 150 });
}
process.exitCode = exitCode;