import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(await fs.readFile(new URL("../lessons/index.json", import.meta.url), "utf8"));
const completeEntries = catalog.lessons.filter((entry) => entry.status === "COMPLETE v0.1");
const entries = catalog.lessons.filter((entry) => entry.learn_path);
const pilotCoverage = JSON.parse(await fs.readFile(new URL("./fixtures/security-learn-coverage.json", import.meta.url), "utf8")).lessons;
const hasCoverage = (body, gate, paragraphs = []) => {
  const candidates = gate.within_paragraph ? paragraphs : [body];
  return candidates.some((text) => gate.terms.every((term) => text.includes(term)));
};
const textOf = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

test("all COMPLETE catalog entries have static Learn HTML independent of RSVP chunk concatenation", async () => {
  assert.equal(entries.length, completeEntries.length, "every COMPLETE lesson must declare a Learn path");
  for (const entry of entries) {
    const html = await fs.readFile(new URL(entry.learn_path.replace(/^\.\//, ""), root), "utf8");
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    assert.ok(article, `${entry.id}: article missing`);
    const body = textOf(article);
    const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => textOf(match[1]));
    assert.ok(/<h1\b/.test(article) && /<h2\b/.test(article) && /<p\b/.test(article), `${entry.id}: semantic article structure missing`);
    assert.ok(body.length > 200, `${entry.id}: initial article text is too short`);
    assert.ok(!/<table\b/i.test(article), `${entry.id}: table-dependent article`);
    assert.ok(!/(上記|下表|上の表|右図|左図|画面の右|画面の左)/.test(body), `${entry.id}: screen-position wording`);
    assert.ok(!/(回答を待つ|回答してください|数秒間待つ|しばらく待ってから|沈黙を置く)/.test(body), `${entry.id}: forced wait or answer request`);
    assert.match(html, /<html\s+lang="ja"/i);
    assert.match(html, /name="viewport"/i);
    assert.match(html, /<title>[^<]+<\/title>/i);
    assert.match(html, /name="description"/i);
    assert.match(html, /id="speech-play"/);
    assert.match(html, /id="speech-pause"/);
    assert.match(html, /id="speech-stop"/);
    assert.match(html, /id="speech-voice"/);
    assert.match(html, /min="0\.7"[^>]*max="4\.0"/);
    assert.match(html, /learn\.js/);
    assert.match(html, /learn\.css/);
    const sourceAt = html.indexOf('<section class="sources"');
    if (sourceAt !== -1) assert.ok(html.indexOf("</article>") < sourceAt, `${entry.id}: sources should be outside article`);
    const lesson = JSON.parse(await fs.readFile(new URL(entry.path.replace(/^\.\//, ""), root), "utf8"));
    const rsvpText = lesson.chunks.map((chunk) => chunk.text).join("");
    assert.notEqual(body, rsvpText, `${entry.id}: article is a direct RSVP chunk concatenation`);
    const review = pilotCoverage[entry.id];
    if (review) {
      const markdown = await fs.readFile(new URL(entry.path.replace(/\.json$/, ".md").replace(/^\.\//, ""), root), "utf8");
      // A static Learn page remains independently readable; coverage is reviewed at the concept level,
      // not by appending every RSVP/Markdown fragment verbatim.
      assert.ok(!/要点の再確認/.test(article), `${entry.id}: verbatim recap section remains`);
      assert.match(article, /<h2>短い振り返り<\/h2>/, `${entry.id}: short contextual recap missing`);
      assert.ok(body.length > 850, `${entry.id}: reviewed lecture lacks explanatory depth`);
      for (const gate of review.gates) {
        assert.ok(hasCoverage(body, gate, paragraphs), `${entry.id}: semantic coverage missing: ${gate.label} (${gate.terms.join(", ")})`);
      }
      const sources = [...markdown.matchAll(/^\s*-\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)/gm)].map((match) => match[1]);
      assert.ok(sources.length > 0, `${entry.id}: reviewed lecture must retain source citations`);
      const sourcesHtml = html.match(/<section class="sources"[\s\S]*?<\/section>/i)?.[0] ?? "";
      for (const url of sources) {
        assert.ok(sourcesHtml.includes(`href="${url.replaceAll("&", "&amp;")}"`) || sourcesHtml.includes(`href="${url}"`),
          `${entry.id}: source from Markdown missing in Learn: ${url}`);
      }
    }
  }
});

test("pilot coverage gates fail closed when essential explanations are absent", () => {
  for (const [id, review] of Object.entries(pilotCoverage)) {
    assert.ok(review.gates.length >= 6, `${id}: too few coverage gates`);
    for (const gate of review.gates) {
      assert.ok(gate.label && gate.terms.length > 0 && gate.terms.every(Boolean));
      assert.equal(hasCoverage("", gate), false, `${id}: empty article must fail ${gate.label}`);
    }
  }
});

test("review gates can require claim and limitation in the same paragraph", () => {
  const gate = { terms: ["パスワード変更", "既存セッション"], within_paragraph: true };
  assert.equal(hasCoverage("パスワード変更と既存セッション", gate, ["パスワード変更のみ", "既存セッションのみ"]), false);
  assert.equal(hasCoverage("パスワード変更だけでは既存セッションが失効しない場合がある", gate,
    ["パスワード変更だけでは既存セッションが失効しない場合がある"]), true);
});

test("expanded Learn coverage includes cases, limitations and verification gates", () => {
  const expanded = [
    "security-social-engineering-bec-phishing",
    "security-malware-ransomware",
    "security-credential-session-attacks",
    "security-identity-proofing-authn-authz"
  ];
  for (const id of expanded) {
    const lesson = pilotCoverage[id];
    assert.ok(lesson, `${id}: expanded coverage missing`);
    assert.ok(lesson.gates.length >= 6, `${id}: explanation gates too few`);
    assert.ok(lesson.gates.some((gate) => gate.within_paragraph), `${id}: no paragraph-level condition gate`);
  }
});

test("shared Learn player exposes Web Speech API and preserves paused voice-change resume", async () => {
  const js = await fs.readFile(new URL("../learn/learn.js", import.meta.url), "utf8");
  assert.match(js, /window\.speechSynthesis/);
  assert.match(js, /SpeechSynthesisUtterance/);
  assert.match(js, /querySelectorAll\("h1, h2, h3, p"\)/);
  assert.match(js, /voiceChangedWhilePaused/);
  assert.match(js, /beforeunload/);
  assert.match(js, /scrollIntoView/);
  assert.match(js, /speech-active/);
  assert.match(js, /mode-nav/);
  assert.match(js, /index\.html\?library=learn/);
  assert.match(js, /index\.html\?library=listen/);
});


test("Learn library exposes course-level continuous playback without replacing single-chapter links", async () => {
  const index = await fs.readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await fs.readFile(new URL("../app.js", import.meta.url), "utf8");
  const player = await fs.readFile(new URL("../learn/course-player.js", import.meta.url), "utf8");

  assert.match(index, /id="learn-course-player"/);
  assert.match(index, /learn\/course-player\.js/);
  assert.match(app, /className = "learn-course-play"/);
  assert.match(app, /dataset\.courseId = course\.id/);
  assert.match(app, /row\.href = item\.learn_path/);

  assert.match(player, /courses\/index\.json/);
  assert.match(player, /lessons\/index\.json/);
  assert.match(player, /course\.chapters\.filter/);
  assert.match(player, /fetch\(meta\.learn_path\)/);
  assert.match(player, /article\.querySelectorAll\("h1, h2, h3, p"\)/);
  assert.match(player, /loadChapter\(chapterIndex \+ 1, activeRun\)/);
  assert.match(player, /SpeechSynthesisUtterance/);
  assert.match(player, /navigator\?\.wakeLock/);
});
