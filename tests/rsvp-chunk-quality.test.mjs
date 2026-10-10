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
    "security-mitre-attack-scenarios": ["正規IDの悪用はT1078の候補です。", "分類と攻撃確定は別の作業です。", "対象ログが届くか確かめます。"],
    "security-password-mfa-phishing-resistant": ["OTPも偽サイトへ渡り得ます。", "認証先の名前と暗号的に結び付けます。", "回復の成否を模擬試験します。"],
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

test("2026-10-09 A: original claims are corrected and Markdown/RSVP stays aligned", async () => {
  const expected = {
    "security-threat-modeling": ["主体や管理領域をまたぐ境界を示します。", "信頼水準が変わる経路も確かめます。"],
    "security-mitre-attack-scenarios": ["正規IDの悪用はT1078の候補です。", "正常操作などの代替仮説も調べます。"],
    "security-password-mfa-phishing-resistant": ["耐性は利用者の注意に依存しません。", "偽の検証者に秘密や有効な出力を渡しません。", "認証先の名前と暗号的に結び付けます。"],
    "security-firewall-proxy-waf-ids-ips": ["復号しない暗号化通信は中身を検査できません。", "障害時の通過動作は構成次第です。"]
  };
  for (const [id, required] of Object.entries(expected)) {
    const directory = path.join(root, "lessons/security-deep");
    const markdown = await fs.readFile(path.join(directory, id + ".md"), "utf8");
    const data = JSON.parse(await fs.readFile(path.join(directory, id + ".json"), "utf8"));
    const numbered = [...markdown.matchAll(/^(\d+)\. (.+)$/gm)];
    assert.equal(numbered.length, data.chunks.length, id + ": count");
    for (let i = 0; i < numbered.length; i++) {
      assert.equal(+numbered[i][1], i+1, id + ": numbering");
      assert.equal(numbered[i][2], data.chunks[i].text, id + ": MD/JSON");
      assert.ok([...data.chunks[i].text].length <= 24, id + ": length");
    }
    for (const phrase of required) assert.ok(data.chunks.some(c => c.text === phrase), id + ": missing " + phrase);
    assert.deepEqual(inspectRsvpChunkBoundaries(data.chunks), [], id + ": boundary");
  }
  assert.doesNotMatch(await fs.readFile(path.join(root, "lessons/security-deep/security-threat-modeling.md"), "utf8"), /権限が変わる信頼境界を示します/);
  assert.doesNotMatch(await fs.readFile(path.join(root, "lessons/security-deep/security-password-mfa-phishing-resistant.md"), "utf8"), /入力値の転送を防ぐ性質です/);
});

test("P1-IP-01: identity resolution, evidence validation, applicant verification and limits stay aligned", async () => {
  const id = "security-identity-proofing-authn-authz";
  const md = await fs.readFile(path.join(root, "lessons/security-deep", id + ".md"), "utf8");
  const data = JSON.parse(await fs.readFile(path.join(root, "lessons/security-deep", id + ".json"), "utf8"));
  const numbered = [...md.matchAll(/^(\d+)\. (.+)$/gm)];
  const texts = data.chunks.map(c => c.text);
  assert.equal(numbered.length, data.chunks.length);
  for (let i = 0; i < numbered.length; i++) {
    assert.equal(Number(numbered[i][1]), i + 1);
    assert.equal(numbered[i][2], texts[i]);
    assert.ok([...texts[i]].length <= 24, "overlong identity chunk " + i);
  }
  const requiredInOrder = [
    "第一はIdentity resolution。",
    "サービスが対象とする集団内で、",
    "主張する身元を区別できるよう、",
    "必要最小限の属性と証拠を集めます。",
    "世界全体の一意性は保証しません。",
    "第二は証拠と属性のvalidationです。",
    "証拠の真正性と属性を確かめます。",
    "第三は身元のverificationです。",
    "証拠と申請者の結び付きを確かめます。",
    "実在性だけでは本人確認は終わりません。"
  ];
  let prior = -1;
  for (const phrase of requiredInOrder) {
    const index = texts.indexOf(phrase);
    assert.ok(index > prior, "missing or reordered proofing claim: " + phrase);
    prior = index;
  }
  for (const phrase of [
    "偽の証拠を受け入れる場合があります。",
    "本物の他人の書類でも誤認は起きます。",
    "真正性だけで申請者本人とはいえません。",
    "強い認証器を後から登録しても、",
    "誤った本人確認は修復されません。",
    "認証成功と認可は別です。",
    "個人情報を過剰収集しません。",
    "リスクに応じた保証を選びます。"
  ]) assert.ok(texts.includes(phrase), "missing proofing limit: " + phrase);
  assert.ok(texts.indexOf("本物の他人の書類でも誤認は起きます。") > texts.indexOf("偽の証拠を受け入れる場合があります。"));
  assert.ok(texts.indexOf("誤った本人確認は修復されません。") > texts.indexOf("強い認証器を後から登録しても、"));
  assert.doesNotMatch(md, /主張された身元の実在性を調べます。/);
  assert.deepEqual(inspectRsvpChunkBoundaries(data.chunks), []);
});
