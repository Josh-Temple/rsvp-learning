import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(await fs.readFile(new URL("../lessons/index.json", import.meta.url), "utf8"));
const completeEntries = catalog.lessons.filter((entry) => entry.status === "COMPLETE v0.1");
const entries = catalog.lessons.filter((entry) => entry.learn_path);
const textOf = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

test("all COMPLETE catalog entries have static Learn HTML independent of RSVP chunk concatenation", async () => {
  assert.equal(entries.length, completeEntries.length, "every COMPLETE lesson must declare a Learn path");
  for (const entry of entries) {
    const html = await fs.readFile(new URL(entry.learn_path.replace(/^\.\//, ""), root), "utf8");
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    assert.ok(article, `${entry.id}: article missing`);
    const body = textOf(article);
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
    const markdown = await fs.readFile(new URL(entry.path.replace(/\.json$/, ".md").replace(/^\.\//, ""), root), "utf8");
    const lessonBody = markdown.match(/^## 本文\\s*([\\s\\S]*?)(?=^## |$)/m)?.[1] ?? "";
    const pronunciations = [
      [/CI[/]CD/g, "シーアイ・シーディー"], [/OAuth/gi, "オーオース"], [/API/g, "エーピーアイ"],
      [/HTTP/g, "エイチティーティーピー"], [/HTTPS/g, "エイチティーティーピーエス"], [/JSON/g, "ジェイソン"],
      [/SQL/g, "エスキューエル"], [/URL/g, "ユーアールエル"], [/DNS/g, "ディーエヌエス"],
      [/CPU/g, "シーピーユー"], [/LLM/g, "エルエルエム"], [/RAG/g, "ラグ"], [/IAM/g, "アイアム"],
      [/KPI/g, "ケーピーアイ"], [/WBS/g, "ダブリュービーエス"], [/PMO/g, "ピーエムオー"],
      [/SaaS/g, "サース"], [/PaaS/g, "パース"], [/IaaS/g, "アイアース"], [/As-Is/g, "アズイズ"],
      [/To-Be/g, "トゥービー"], [/GitHub/gi, "ギットハブ"], [/Git/gi, "ギット"], [/CI/g, "シーアイ"],
      [/CD/g, "シーディー"], [/PMBOK/g, "ピーエムボック"], [/ROI/g, "アールオーアイ"],
      [/MTTR/g, "エムティーティーアール"], [/MTBF/g, "エムティービーエフ"],
    ];
    for (const line of lessonBody.split(/\\r?\\n/).map((value) => value.trim()).filter(Boolean)) {
      const item = line.replace(/^\\d+[.)、]\\s*/, "").replace(/[。！？]+$/, "");
      const spoken = pronunciations.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), item);
      assert.ok(body.includes(spoken), `${entry.id}: Learn text omits Markdown item: ${item}`);
    }
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
});
