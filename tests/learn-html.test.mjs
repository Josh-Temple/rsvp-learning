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


test("authenticated mail heading does not imply authentication proves safety", async () => {
  const html = await fs.readFile(new URL("../learn/security-email-spf-dkim-dmarc.html", import.meta.url), "utf8");
  assert.match(html, /<h2>認証済みでも安全とは限らない<\/h2>/);
  assert.doesNotMatch(html, /認証済みでも詐欺メールとは限らない/);
});


test("continuous Learn course shows current chapter sources outside the speech track", async () => {
  const index = await fs.readFile(new URL("../index.html", import.meta.url), "utf8");
  const player = await fs.readFile(new URL("../learn/course-player.js", import.meta.url), "utf8");
  assert.match(index, /id="learn-course-sources"[^>]*hidden/);
  assert.match(player, /parsed\.querySelector\("section\.sources"\)/);
  assert.match(player, /sources\.innerHTML = parsed\.citations/);
  assert.match(player, /sources\.hidden = !parsed\.citations\.trim\(\)/);
  assert.match(player, /items = \[\.\.\.article\.querySelectorAll/);
  for (const id of [
    "security-risk-assessment",
    "security-sessions-federation-oauth-oidc-saml",
    "security-cloud-shared-responsibility-iam-config",
    "security-email-spf-dkim-dmarc"
  ]) {
    const html = await fs.readFile(new URL("../learn/" + id + ".html", import.meta.url), "utf8");
    assert.match(html, /<\/article>\s*<section class="sources"/, id + ": citations should be available outside the spoken article");
    assert.match(html, /<section class="sources"[\s\S]*?<a href="https:\/\//, id + ": source links absent");
  }
});

test("four new security Learn lectures retain A-head cases, limits, and separate source sections", async () => {
  const ids = [
    "security-threat-modeling",
    "security-mitre-attack-scenarios",
    "security-password-mfa-phishing-resistant",
    "security-firewall-proxy-waf-ids-ips"
  ];
  for (const id of ids) {
    const html = await fs.readFile(new URL("../learn/" + id + ".html", import.meta.url), "utf8");
    const article = html.split('<article id="learn-article">')[1]?.split("</article>")[0];
    assert.ok(article, id + ": article missing");
    assert.ok(article.includes("<h2>短い振り返り</h2>"), id + ": contextual recap missing");
    assert.ok(!article.includes("<h2>要点の再確認</h2>"), id + ": old verbatim list remains");
    assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'), id + ": sources in speech track");
    const gates = pilotCoverage[id]?.gates ?? [];
    assert.ok(gates.length >= 6 && gates.some((gate) => gate.within_paragraph), id + ": conditional coverage absent");
  }
  const mitre = await fs.readFile(new URL("../learn/security-mitre-attack-scenarios.html", import.meta.url), "utf8");
  const firewall = await fs.readFile(new URL("../learn/security-firewall-proxy-waf-ids-ips.html", import.meta.url), "utf8");
  assert.ok(mitre.includes('href="https://attack.mitre.org/techniques/T1078/"'), "T1078 primary source missing");
  assert.ok(firewall.includes('href="https://csrc.nist.gov/pubs/sp/800/94/final"'), "IDPS reference missing");
});


test("P1-IP-01 Learn: three proofing steps, limitations, and regression counterexamples", async () => {
  const html = await fs.readFile(new URL("../learn/security-identity-proofing-authn-authz.html", import.meta.url), "utf8");
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  assert.ok(article, "identity proofing article missing");
  const checks = [
    ["resolution", ["identity resolution", "対象とする集団内", "区別", "必要な属性と証拠", "集めます"]],
    ["world uniqueness limit", ["世界全体", "唯一", "保証する作業ではありません"]],
    ["validation", ["evidence validation", "証拠の真正性", "属性の正確さ"]],
    ["verification", ["identity verification", "申請者本人", "結び付き"]],
    ["counterfeit versus genuine-other", ["偽造された証拠", "本物の他人の書類", "書類が真正でも"]],
    ["strong authenticator cannot repair initial proofing", ["強い認証器", "最初の本人確認", "取り消されません"]],
    ["privacy and use limits", ["必要な範囲", "個人情報", "用途"]]
  ];
  const check = (speechArticle) => {
    const paragraphs = [...speechArticle.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => textOf(match[1]));
    const opening = textOf(speechArticle.match(/<h2\b[^>]*>[^<]+<\/h2>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "");
    assert.ok(opening.includes("実在性を調べるだけで終わりません") &&
      opening.includes("対象とする集団") && opening.includes("属性と証拠") &&
      opening.includes("区別"), "intro must not reduce proofing to existence only");
    assert.doesNotMatch(textOf(speechArticle), /名乗った身元が実在するか、提出された証拠が妥当か/);
    for (const [label, terms] of checks) {
      assert.ok(paragraphs.some((p) => terms.every((term) => p.includes(term))),
        "P1-IP-01 " + label + ": one contextual paragraph is required");
    }
  };
  check(article);
  const mutations = [
    ["intro", "本人確認は名乗った身元の実在性を調べるだけで終わりません。サービスが対象とする集団の中で身元を区別するための属性と証拠を集め、証拠の真正性と属性の正確さを確かめ、申請者本人とその証拠の結び付きを確認します。",
     "本人確認は、名乗った身元が実在するか、提出された証拠が妥当かを確かめます。", "intro"],
    ["resolution", "サービスが対象とする集団内で主張された身元を区別できるよう、本人確認に必要な属性と証拠を集めます。",
     "主張された身元が実在するか調べます。", "resolution"],
    ["validation", "続くevidence validationでは、証拠の真正性、有効性、属性の正確さを確かめます。",
     "続いて書類を調べます。", "validation"],
    ["verification", "最後のidentity verificationでは、申請者本人と提示された証拠の結び付きを確かめます。",
     "最後は登録を進めます。", "verification"],
    ["authenticator", "認証器の使用が確認されても、最初の本人確認の誤りは取り消されません。",
     "認証器の使用が確認されれば、過去の本人確認の誤りも解消します。", "strong authenticator"],
    ["privacy", "高い保証が必要でも、本人確認に必要な範囲を超えて個人情報を集めれば別のリスクを作ります。",
     "本人確認では多くの情報を集めます。", "privacy"]
  ];
  for (const [name, original, replacement, expected] of mutations) {
    assert.ok(article.includes(original), name + ": mutation source phrase has drifted");
    assert.throws(() => check(article.replace(original, replacement)),
      new RegExp(expected), name + ": downgrade went unnoticed");
  }
});

test("critical identity, federation and cloud conditions remain in their Learn lectures", async () => {
  const cases = {
    "security-identity-proofing-authn-authz": ["本人確認は証拠と申請者の結び付きも評価", "認証器の制御と身元の再証明は別"],
    "security-sessions-federation-oauth-oidc-saml": ["アクセス用トークンの受け取り先検証", "RPの既存セッションは構成依存"],
    "security-cloud-shared-responsibility-iam-config": ["IaaSとSaaSで契約に依存する責任", "証拠のない責任分界は判断保留"]
  };
  for (const [id, labels] of Object.entries(cases)) {
    const html = await fs.readFile(new URL("../learn/" + id + ".html", import.meta.url), "utf8");
    const start = '<article id="learn-article">';
    assert.ok(html.includes(start) && html.includes("</article>"), id + ": article missing");
    const article = html.split(start)[1].split("</article>")[0];
    const paragraphs = article.split("<p").slice(1).map((fragment) => textOf("<p" + fragment.split("</p>")[0] + "</p>"));
    const gates = pilotCoverage[id]?.gates ?? [];
    for (const label of labels) {
      const gate = gates.find((candidate) => candidate.label === label);
      assert.ok(gate && gate.within_paragraph, id + ": conditional gate missing: " + label);
      assert.ok(hasCoverage(textOf(article), gate, paragraphs), id + ": condition absent: " + label);
    }
    assert.ok(!article.includes("要点の再確認"), id + ": verbatim recap returned");
  }
  const cloud = await fs.readFile(new URL("../learn/security-cloud-shared-responsibility-iam-config.html", import.meta.url), "utf8");
  assert.ok(cloud.includes('href="https://www.cisa.gov/sites/default/files/2023-02/cloud_security_technical_reference_architecture_2.pdf"'));
  assert.ok(cloud.includes('href="https://aws.amazon.com/jp/compliance/shared-responsibility-model/"'));
});


