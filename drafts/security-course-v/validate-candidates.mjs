import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { inspectRsvpChunkBoundaries } from "../../scripts/rsvp-chunk-boundaries.mjs";

export const ids = ["security-secure-by-design-default", "security-input-output-injection"];
export const candidateRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(candidateRoot, "../..");
const schema = JSON.parse(await fs.readFile(path.join(repositoryRoot, "schema/lesson.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

export function numberedBody(markdown) {
  const body = markdown.split("## 本文\n")[1]?.split("\n## ")[0];
  assert.ok(body, "numbered Markdown body missing");
  const entries = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
  assert.ok(entries.length, "body has no numbered entries");
  entries.forEach((match, index) => assert.equal(Number(match[1]), index + 1, "continuous body numbering"));
  return entries.map((match) => match[2]);
}

function markdownSources(markdown) {
  const section = markdown.split("## 出典\n")[1];
  assert.ok(section, "Markdown sources missing");
  return [...section.matchAll(/^- \[([^\]]+)\]\(([^\s)]+)\)$/gm)]
    .map((match) => ({ title: match[1], url: match[2] }));
}

export function article(html) {
  assert.equal((html.match(/<article\b/g) ?? []).length, 1, "exactly one speech article");
  const result = html.match(/<article id="learn-article">([\s\S]*?)<\/article>/);
  assert.ok(result, "static speech article missing");
  return result[1];
}

export function validateCoupledText(markdown, lesson) {
  assert.ok(validateSchema(lesson), JSON.stringify(validateSchema.errors));
  const entries = numberedBody(markdown);
  assert.deepEqual(lesson.chunks.map((chunk) => chunk.text), entries, "full numbered text/order/punctuation/negation sync");
  for (const [index, text] of entries.entries()) {
    assert.ok([...text].length <= 24, `chunk ${index + 1} exceeds 24 Unicode code points`);
  }
  assert.deepEqual(inspectRsvpChunkBoundaries(lesson.chunks).filter((finding) => finding.severity === "ERROR"), [], "English term broken between chunks");
  const terms = entries.join("").match(/[A-Za-z][A-Za-z0-9]*(?:[ -][A-Za-z][A-Za-z0-9]*)*/g) ?? [];
  for (const term of terms) assert.ok(entries.some((text) => text.includes(term)), `English term ${term} split`);
  assert.deepEqual(lesson.sources, markdownSources(markdown), "Markdown/JSON source title and URL order");
  return entries;
}

export function validateLearn(html, lesson) {
  const body = article(html);
  assert.doesNotMatch(body, /https?:\/\/|<a\b|<table\b|<ul\b|<ol\b|<script\b|<code\b|<blockquote\b/, "speech article must be continuous static lecture with sources outside");
  assert.doesNotMatch(body, /上記|下表|右図|回答してください|考えてみてください|要点の再確認/);
  assert.match(body, /<h1>/);
  assert.match(body, /<h2>短い振り返り<\/h2>/);
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([^<]+)<\/p>/g)].map((match) => match[1]);
  assert.ok(paragraphs.length > 1, "lecture paragraphs missing");
  assert.notEqual(paragraphs.join(""), lesson.chunks.map((chunk) => chunk.text).join(""), "Learn must not be RSVP concatenation");
  const section = html.match(/<section class="sources"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(section && html.indexOf(section[0]) > html.indexOf("</article>"), "sources must follow speech article");
  const sources = [...section[1].matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)]
    .map((match) => ({ title: match[2], url: match[1] }));
  assert.deepEqual(sources, lesson.sources, "source titles/URLs match three formats");
  assert.match(html, /data-publication="HOLD"/);
  return body;
}

export function validateMeaning(markdown, html, claims) {
  const entries = numberedBody(markdown);
  const body = article(html);
  for (const claim of claims) {
    assert.ok(claim.markdown_ranges.length && claim.learn_paragraphs.length, `${claim.id}: mapping missing`);
    const text = claim.markdown_ranges.map(([start, end]) => {
      assert.ok(Number.isInteger(start) && start >= 1 && end >= start && end <= entries.length, `${claim.id}: invalid range`);
      return entries.slice(start - 1, end).join("");
    }).join("");
    for (const fragment of claim.markdown_assertions) assert.ok(text.includes(fragment), `${claim.id}: Markdown meaning/limitation missing: ${fragment}`);
    const selected = new Map(claim.learn_paragraphs.map((id) => {
      const match = body.match(new RegExp(`<p id="${id}"(?: class="[^"]*")?>([^<]+)</p>`));
      assert.ok(match, `${claim.id}: Learn paragraph ${id} missing`);
      return [id, match[1]];
    }));
    for (const gate of claim.learn_assertions) {
      assert.ok(selected.has(gate.paragraph), `${claim.id}: gate outside mapped paragraphs`);
      for (const fragment of gate.fragments) assert.ok(selected.get(gate.paragraph).includes(fragment), `${claim.id}: Learn meaning/limitation missing: ${fragment}`);
    }
  }
}

export function validateHold(markdown, html, lesson, catalog, courses) {
  assert.match(markdown, /^Status: DRAFT v0\.1$/m);
  assert.match(markdown, /^Publication: HOLD$/m);
  assert.doesNotMatch(markdown, /^Status: COMPLETE/m);
  assert.match(html, /data-publication="HOLD"/);
  assert.ok(!JSON.stringify(catalog).includes(lesson.id), "candidate registered in lesson Catalog");
  assert.ok(!JSON.stringify(courses).includes(lesson.id), "candidate registered in Course Catalog");
}

export async function loadInputs(id) {
  const paths = [
    path.join(candidateRoot, "lessons", `${id}.md`), path.join(candidateRoot, "lessons", `${id}.json`),
    path.join(candidateRoot, "learn", `${id}.html`), path.join(candidateRoot, "claims.json"),
    path.join(candidateRoot, "source-registry.json"), path.join(repositoryRoot, "lessons/index.json"),
    path.join(repositoryRoot, "courses/index.json"),
  ];
  const [markdown, json, html, mapping, sources, catalog, courses] = await Promise.all(paths.map((file) => fs.readFile(file, "utf8")));
  return { markdown, lesson: JSON.parse(json), html, claims: JSON.parse(mapping).claims.filter((claim) => claim.lesson_id === id),
    registry: JSON.parse(sources), catalog: JSON.parse(catalog), courses: JSON.parse(courses) };
}

export function validateCandidate(input) {
  const { markdown, lesson, html, claims, registry, catalog, courses } = input;
  assert.ok(ids.includes(lesson.id));
  validateCoupledText(markdown, lesson);
  validateLearn(html, lesson);
  validateMeaning(markdown, html, claims);
  validateHold(markdown, html, lesson, catalog, courses);
  assert.equal(claims.length, lesson.id === ids[0] ? 9 : 12, "important claim count");
  const sourceMap = new Map(registry.sources.map((source) => [source.id, source]));
  const sourceUrls = new Set(registry.sources.flatMap((source) => source.urls));
  for (const source of lesson.sources) assert.ok(sourceUrls.has(source.url), `unreviewed source URL: ${source.url}`);
  for (const claim of claims) {
    assert.ok(claim.source_ids.length, `${claim.id}: no evidence`);
    for (const sourceId of claim.source_ids) {
      const source = sourceMap.get(sourceId);
      assert.ok(source && source.verification === "source_verified", `${claim.id}: source ${sourceId} not verified`);
      assert.ok(source.urls.some((url) => lesson.sources.some((item) => item.url === url)), `${claim.id}: source ${sourceId} not in lesson`);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let chunks = 0;
  for (const id of ids) {
    const input = await loadInputs(id);
    validateCandidate(input);
    chunks += input.lesson.chunks.length;
    console.log(`${id}: PASS (${input.lesson.chunks.length} chunks, ${input.claims.length} mapped claims, HOLD)`);
  }
  console.log(`Course V candidates: PASS (2 lessons, ${chunks} chunks; no publication acceptance)`);
}
