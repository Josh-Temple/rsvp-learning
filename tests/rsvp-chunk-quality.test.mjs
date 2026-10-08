import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { inspectRsvpChunkBoundaries } from "../scripts/rsvp-chunk-boundaries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chunks = (...texts) => texts.map((text) => ({ text, duration_multiplier: 1.15 }));

test("rejects split Latin terms even when both chunks are under 24 characters", () => {
  for (const items of [
    chunks("Infrastructure as Co", "deも使えます。"),
    chunks("Display name spoofin", "gも残ります。"),
    chunks("SaaSは設定がAttack surfa", "ceです。"),
    chunks("重要AccessをManaged dev", "iceへ限定できます。"),
  ]) {
    assert.ok(items.every((item) => [...item.text].length <= 24));
    const found = inspectRsvpChunkBoundaries(items);
    assert.equal(found.length, 1);
    assert.equal(found[0].code, "ADJACENT_LATIN_TEXT");
    assert.equal(found[0].severity, "ERROR");
    assert.equal(found[0].index, 0);
  }
});

test("accepts intact terminology and complete sentence boundaries", () => {
  const found = inspectRsvpChunkBoundaries(chunks(
    "Infrastructure as Code",
    "構成をコードとして管理します。",
    "IaaSがあります。",
    "PaaSもあります。",
    "Display name spoofing",
    "表示名の偽装も残ります。",
  ));
  assert.equal(found.filter((item) => item.severity === "ERROR").length, 0);
});

test("possible Japanese particle splits are review findings, not automatic errors", () => {
  const found = inspectRsvpChunkBoundaries(chunks("Configuration driftを", "監視します。"));
  assert.equal(found.length, 1);
  assert.equal(found[0].code, "POSSIBLE_PARTICLE_SPLIT");
  assert.equal(found[0].severity, "REVIEW");
  assert.deepEqual(inspectRsvpChunkBoundaries(chunks("監視します。", "設定も見直します。")), []);
});

test("invalid chunks do not crash the boundary check", () => {
  assert.deepEqual(inspectRsvpChunkBoundaries(null), []);
  assert.deepEqual(inspectRsvpChunkBoundaries([{ text: null }, { text: "Example" }]), []);
});

test("security-deep catalog lessons contain no adjacent Latin-letter boundaries", async () => {
  const index = JSON.parse(await fs.readFile(path.join(root, "lessons/index.json"), "utf8"));
  const entries = index.lessons.filter((meta) => /^\.\/lessons\/security-deep\//.test(meta.path));
  assert.equal(entries.length, 30, "review scope changed: update coverage deliberately");
  for (const meta of entries) {
    const lesson = JSON.parse(await fs.readFile(path.join(root, meta.path), "utf8"));
    const errors = inspectRsvpChunkBoundaries(lesson.chunks).filter((item) => item.severity === "ERROR");
    assert.deepEqual(errors, [], meta.id + ": split technical term");
    for (const [index, chunk] of lesson.chunks.entries()) {
      assert.ok([...chunk.text].length <= 24, meta.id + " chunks[" + index + "] exceeds 24 chars");
    }
  }
});

test("content validator rejects broken Latin words in new security-deep lessons", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "rsvp-split-regression-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const directory of ["schema", "lessons/security-deep", "courses"]) {
    await fs.mkdir(path.join(dir, directory), { recursive: true });
  }
  await fs.copyFile(path.join(root, "schema/lesson.schema.json"), path.join(dir, "schema/lesson.schema.json"));
  await fs.writeFile(path.join(dir, "lessons/index.json"), JSON.stringify({ lessons: [{
    id: "split-test", title: "Test", path: "./lessons/security-deep/split-test.json",
  }] }));
  await fs.writeFile(path.join(dir, "courses/index.json"), JSON.stringify({ courses: [{
    id: "test-course", chapters: ["split-test"],
  }] }));
  await fs.writeFile(path.join(dir, "lessons/security-deep/split-test.json"), JSON.stringify({
    schema_version: 1, id: "split-test", title: "Test", topic: "Security", summary: "Test",
    created_at: "2026-10-08", base_duration_ms: 680,
    sources: [{ title: "Example", url: "https://example.com" }],
    chunks: chunks("Infrastructure as Co", "deも使えます。"),
  }));
  const result = spawnSync(process.execPath, [path.join(root, "scripts/validate-content.mjs")], {
    cwd: dir, encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /専門用語の分割疑い/);
});

test("compound particles and dangling predicates are review findings, not universal errors", () => {
  const compound = inspectRsvpChunkBoundaries(chunks("登録に", "も誤りがあります。"));
  assert.equal(compound.length, 1);
  assert.equal(compound[0].code, "POSSIBLE_COMPOUND_PARTICLE_SPLIT");
  assert.equal(compound[0].severity, "REVIEW");

  for (const [left, right] of [
    ["OAuthの範囲を", "確認します。"],
    ["署名とは", "異なります。"],
    ["緊急更新も", "訓練します。"],
    ["負荷分散装置で", "終端できます。"],
  ]) {
    const result = inspectRsvpChunkBoundaries(chunks(left, right));
    assert.equal(result.length, 1, left + " / " + right);
    assert.equal(result[0].severity, "REVIEW");
  }
  assert.deepEqual(inspectRsvpChunkBoundaries(chunks("登録します。", "権限も見直します。")), []);
});

test("all 30 security-deep lessons have no undocumented Japanese boundary review findings", async () => {
  const index = JSON.parse(await fs.readFile(path.join(root, "lessons/index.json"), "utf8"));
  const entries = index.lessons.filter((meta) => /^\.\/lessons\/security-deep\//.test(meta.path));
  assert.equal(entries.length, 30, "scope changed: re-audit before expanding the test");
  // Accepted exceptions require an ID, boundary location, and documented rationale.
  const accepted = new Set();
  const outstanding = [];
  for (const meta of entries) {
    const lesson = JSON.parse(await fs.readFile(path.join(root, meta.path), "utf8"));
    for (const issue of inspectRsvpChunkBoundaries(lesson.chunks)) {
      if (issue.severity !== "REVIEW") continue;
      const key = meta.id + "@" + issue.index;
      if (!accepted.has(key)) outstanding.push(key + ": " + issue.left + " / " + issue.right);
    }
  }
  assert.deepEqual(outstanding, [], "Human-review boundaries must be corrected or justified: " + outstanding.join("; "));
});

test("2026-10-09 A: four revised security lessons retain complete chunks and scenarios", async () => {
  const expected = {
    "security-threat-modeling": ["架空の住民申請サービスを考えます。", "API側でも権限を確認します。", "試験結果も記録して確認します。"],
    "security-mitre-attack-scenarios": ["Valid Accountsが分類候補です。", "分類と攻撃確定は別の作業です。", "対象ログが届くか確かめます。"],
    "security-password-mfa-phishing-resistant": ["OTPも偽サイトへ渡り得ます。", "認証先の名前にも結び付けます。", "回復の成否を模擬試験します。"],
    "security-firewall-proxy-waf-ids-ips": ["WAFはアプリ修正の代替ではありません。", "API側の認可が必要です。", "迂回経路があれば効果は限定的です。"],
  };
  for (const [id, required] of Object.entries(expected)) {
    const lesson = JSON.parse(await fs.readFile(path.join(root, "lessons/security-deep", id + ".json"), "utf8"));
    const items = lesson.chunks.map((item) => item.text);
    for (const phrase of required) assert.ok(items.includes(phrase), id + " lost: " + phrase);
    assert.ok(items.every((item) => [...item].length <= 24), id + ": overlong chunk");
    assert.deepEqual(inspectRsvpChunkBoundaries(lesson.chunks), [], id + ": boundary review finding");
  }
});
