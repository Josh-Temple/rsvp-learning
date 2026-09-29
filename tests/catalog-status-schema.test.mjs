import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(await fs.readFile(new URL("../schema/lesson-catalog.schema.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await fs.readFile(new URL("../lessons/index.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const meta = { id: "sample", title: "教材", topic: "基礎", path: "./lessons/sample.json" };

test("lesson catalog requires and accepts current synchronized statuses", () => {
  assert.equal(validate(catalog), true, ajv.errorsText(validate.errors));
  assert.equal(validate({ lessons: [meta] }), false);
  assert.equal(validate({ lessons: [{ ...meta, status: "SEED / 概要のみ" }] }), true);
  assert.equal(validate({ lessons: [{ ...meta, status: "DRAFT v0.1" }] }), true);
  assert.equal(validate({ lessons: [{ ...meta, status: "COMPLETE v0.1", learn_path: "./learn/sample.html" }] }), true);
});

test("complete requires a Learn path and unfinished states cannot declare one", () => {
  assert.equal(validate({ lessons: [{ ...meta, status: "COMPLETE v0.1" }] }), false);
  assert.equal(validate({ lessons: [{ ...meta, status: "DRAFT v0.1", learn_path: "./learn/sample.html" }] }), false);
  assert.equal(validate({ lessons: [{ ...meta, status: "APPROVED" }] }), false);
});
