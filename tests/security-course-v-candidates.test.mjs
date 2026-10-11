import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ids, loadInputs, validateCandidate, validateCoupledText, validateHold,
  validateLearn, validateMeaning } from "../drafts/security-course-v/validate-candidates.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputs = await Promise.all(ids.map(loadInputs));
const fresh = (index) => structuredClone(inputs[index]);
const run = (command, args, input) => spawnSync(command, args, {
  cwd: repositoryRoot, encoding: "utf8", input,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
});
const replaceCoupled = (input, before, after) => {
  assert.ok(input.markdown.includes(before), "mutation target absent");
  input.markdown = input.markdown.replace(before, after);
  let changed = false;
  for (const chunk of input.lesson.chunks) {
    if (chunk.text.includes(before)) { chunk.text = chunk.text.replace(before, after); changed = true; }
  }
  assert.ok(changed, "mutation must change a canonical numbered chunk");
};

for (const [index, id] of ids.entries()) {
  test(`${id}: schema, exact text, sources, 24-character terms, mapped limitations and HOLD`, () => validateCandidate(fresh(index)));
}

test("primary source record distinguishes inaccessible CISA, SSDF draft and stable ASVS", () => {
  const registry = inputs[0].registry;
  const byId = new Map(registry.sources.map((source) => [source.id, source]));
  assert.equal(byId.get("S01a").verification, "not_verified");
  assert.equal(byId.get("S01").freshness, "partial");
  assert.match(byId.get("S02").version, /1\.1 Final/);
  assert.match(byId.get("S02a").version, /1\.2 Initial Public Draft/);
  assert.equal(byId.get("S12").tag, "v5.0.0_release");
  assert.equal(byId.get("S12").revision, "5cf9b032440be53ce345ab3c130fda46ba1ce7a2");
  for (const id of ["S05", "S06", "S07", "S08", "S09", "S10", "S11"]) {
    const source = byId.get(id);
    assert.equal(source.revision, "cb9fe01e5ddf17b42513d2c53c4b86196c665c45");
    assert.match(source.blob_sha, /^[a-f0-9]{40}$/);
    assert.ok(source.immutable_url.includes(source.revision));
    assert.ok(source.read_sections.length);
  }
});

test("RSVP and human format map regenerate without changing reviewed artifacts", () => {
  for (const file of ["sync-rsvp.mjs", "render-map.mjs"]) {
    const result = run(process.execPath, [`drafts/security-course-v/${file}`, "--check"]);
    assert.equal(result.status, 0, result.stderr);
  }
});

test("candidate HTML uses balanced static DOM and resolves existing player/navigation assets", () => {
  const result = run("python3", ["drafts/security-course-v/validate-html.py"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 pages/);
});

test("unbalanced HTML mutation fails standard HTML parser inspection", () => {
  const invalid = inputs[0].html.replace("</p>", "");
  const result = run("python3", ["drafts/security-course-v/validate-html.py", "--stdin"], invalid);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unbalanced|unclosed/);
});

test("source section moved into speech article is rejected", () => {
  const input = fresh(1);
  const sources = input.html.match(/<section class="sources"[\s\S]*?<\/section>/)[0];
  input.html = input.html.replace(sources, "").replace("</article>", sources + "</article>");
  assert.throws(() => validateLearn(input.html, input.lesson), /speech article|sources must follow/);
});

test("RSVP concatenation disguised as a lecture is rejected", () => {
  const input = fresh(0);
  const text = input.lesson.chunks.map((chunk) => chunk.text).join("");
  input.html = input.html.replace(/(<article id="learn-article">)[\s\S]*?(<\/article>)/, `$1<h1>講義</h1><p>${text.slice(0, 100)}</p><p>${text.slice(100)}</p><h2>短い振り返り</h2>$2`);
  assert.throws(() => validateLearn(input.html, input.lesson), /RSVP concatenation/);
});

test("COMPLETE promotion and Catalog/Course registration fail the candidate-only gate", () => {
  const input = fresh(0);
  assert.throws(() => validateHold(input.markdown.replace("Status: DRAFT", "Status: COMPLETE"), input.html, input.lesson, input.catalog, input.courses));
  assert.throws(() => validateHold(input.markdown, input.html, input.lesson,
    { lessons: [{ id: input.lesson.id }] }, input.courses), /lesson Catalog/);
  assert.throws(() => validateHold(input.markdown, input.html, input.lesson,
    input.catalog, { chapters: [input.lesson.id] }), /Course Catalog/);
});

test("a punctuation or negation change in JSON alone fails full text synchronization", () => {
  const input = fresh(1);
  input.lesson.chunks[0].text = input.lesson.chunks[0].text.replace("しません。", "します。");
  assert.throws(() => validateCoupledText(input.markdown, input.lesson), /text\/order\/punctuation\/negation/);
});

test("an English term split fails even when Markdown and JSON still concatenate identically", () => {
  const input = fresh(0);
  const index = input.lesson.chunks.findIndex((chunk) => chunk.text.includes("Secure by Design"));
  const original = input.lesson.chunks[index].text;
  const chunks = input.lesson.chunks.map((chunk) => chunk.text);
  chunks.splice(index, 1, original.slice(0, 12), original.slice(12));
  input.markdown = input.markdown.replace(/(## 本文\n)[\s\S]*?(\n## 理解確認)/,
    `$1${chunks.map((text, i) => `${i + 1}. ${text}`).join("\n")}\n$2`);
  input.lesson.chunks.splice(index, 1, { text: original.slice(0, 12), duration_multiplier: 1 }, { text: original.slice(12), duration_multiplier: 1 });
  assert.throws(() => validateCoupledText(input.markdown, input.lesson), /English term/);
});

test("the 24-character cap cannot be bypassed by changing both canonical forms", () => {
  const input = fresh(1);
  replaceCoupled(input, input.lesson.chunks[0].text, "検証用の長さ制約を超える文章です。これは許可されません。");
  assert.throws(() => validateCoupledText(input.markdown, input.lesson), /exceeds 24/);
});

test("design/default relation reversal fails despite synchronized text and surviving keywords", () => {
  const input = fresh(0);
  replaceCoupled(input, "安全な初期設定は安全な設計の一部です。", "安全な初期設定は安全な設計と無関係です。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, input.html, input.claims), /V1-01/);
});

test("public-resource exception negation cannot disappear from either canonical or Learn text", () => {
  const input = fresh(0);
  replaceCoupled(input, "全機能へのログイン強制を意味しません。", "全機能へのログイン強制を意味します。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, inputs[0].html, input.claims), /V1-07/);
  const changedLearn = inputs[0].html.replace("全機能にログインを要求するという意味ではありません", "全機能にログインを要求するという意味です");
  assert.throws(() => validateMeaning(inputs[0].markdown, changedLearn, input.claims), /V1-07/);
});

test("removing the distributed-revocation limitation is detected in Learn", () => {
  const input = fresh(0);
  input.html = input.html.replace("競合まで確認したことにはなりません", "競合も確認したことになります");
  assert.throws(() => validateMeaning(input.markdown, input.html, input.claims), /V1-06/);
});

test("textContent safety inversion for script/style is caught in both forms", () => {
  const input = fresh(1);
  replaceCoupled(input, "同じ安全性を主張できません。", "同じ安全性を主張できます。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, inputs[1].html, input.claims), /V2-07/);
  const changedLearn = inputs[1].html.replace("scriptやstyle要素の非信頼内容には同じ安全性を主張できません", "scriptやstyle要素の非信頼内容にも同じ安全性を主張できます");
  assert.throws(() => validateMeaning(inputs[1].markdown, changedLearn, input.claims), /V2-07/);
});

test("autoescape-as-SSTI-prevention inversion fails despite retained technical terms", () => {
  const input = fresh(1);
  replaceCoupled(input, "SSTIの防止にはなりません。", "SSTIの防止になります。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, inputs[1].html, input.claims), /V2-10/);
  const changedLearn = inputs[1].html.replace("防止にはなりません", "防止になります");
  assert.throws(() => validateMeaning(inputs[1].markdown, changedLearn, input.claims), /V2-10/);
});

test("a parameterization claim must retain the correct driver API condition", () => {
  const input = fresh(1);
  replaceCoupled(input, "正しいバインドAPIを確認します。", "バインドAPIの名称を確認します。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, inputs[1].html, input.claims), /V2-04/);
  const changedLearn = inputs[1].html.replace("バインドAPIを正しく使うことが条件", "バインドAPIという名称なら十分");
  assert.throws(() => validateMeaning(inputs[1].markdown, changedLearn, input.claims), /V2-04/);
});

test("injection/authorization independence cannot be replaced with a universal safety claim", () => {
  const input = fresh(1);
  replaceCoupled(input, "Injection対策と認可も別です。", "Injection対策だけで認可も済みます。");
  validateCoupledText(input.markdown, input.lesson);
  assert.throws(() => validateMeaning(input.markdown, input.html, input.claims), /V2-12/);
});

test("the field-dependent normalization limitation is preserved", () => {
  const input = fresh(1);
  input.html = input.html.replace("すべての氏名を一律の規則で変換するという意味ではありません", "すべての氏名を一律の規則で変換します");
  assert.throws(() => validateMeaning(input.markdown, input.html, input.claims), /V2-03/);
});

test("ten judgement questions include two elements, 2/1/0 rubrics and condition changes", async () => {
  const questions = await fs.readFile(path.join(repositoryRoot, "drafts/security-course-v/QUESTIONS.md"), "utf8");
  const blocks = questions.split(/^### V[12]-Q\d+：/m).slice(1);
  assert.equal(blocks.length, 10);
  for (const block of blocks) {
    for (const label of ["測定する判断能力", "要素A", "要素B", "模範解答", "2点", "1点例", "0点例", "条件変更"]) assert.ok(block.includes(label));
  }
  assert.match(questions, /Quiz UI.*未実装／未測定/);
});

test("safe local executable examples check authorization, SQLite values and ordinary HTML text", () => {
  const result = run("python3", ["-m", "unittest", "discover", "-s", "drafts/security-course-v/examples", "-v"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /Ran 17 tests/);
  assert.match(result.stderr, /\nOK\n/);
});
