import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

function makeClassList() {
  const values = new Set();
  return {
    add(...items) { items.forEach((item) => values.add(item)); },
    remove(...items) { items.forEach((item) => values.delete(item)); },
    toggle(item, force) {
      if (force === undefined) {
        if (values.has(item)) values.delete(item);
        else values.add(item);
        return values.has(item);
      }
      if (force) values.add(item);
      else values.delete(item);
      return force;
    },
    contains(item) { return values.has(item); },
  };
}

function makeElement() {
  return {
    hidden: false,
    textContent: "",
    value: "",
    disabled: false,
    dataset: {},
    style: {},
    className: "",
    classList: makeClassList(),
    children: [],
    addEventListener() {},
    setAttribute() {},
    focus() {},
    matches() { return false; },
    replaceChildren(...children) { this.children = [...children]; },
    append(...children) { this.children.push(...children); },
    querySelectorAll() { return []; },
  };
}

function makeHarness(fetchImpl) {
  const elements = new Map();
  const masteryButtons = [1, 2, 3].map((level) => {
    const button = makeElement();
    button.dataset.level = String(level);
    return button;
  });

  const getElement = (selector) => {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  };

  getElement("#library-overlay").hidden = true;
  getElement("#mastery-control").querySelectorAll = () => masteryButtons;

  const storage = new Map();
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
  };

  const document = {
    documentElement: { dataset: { theme: "light" } },
    body: { classList: makeClassList() },
    querySelector: getElement,
    createElement: makeElement,
    addEventListener() {},
  };

  const colorScheme = {
    matches: false,
    addEventListener() {},
  };

  const context = vm.createContext({
    console,
    document,
    localStorage,
    navigator: {},
    window: {
      matchMedia() { return colorScheme; },
      addEventListener() {},
    },
    fetch: fetchImpl,
    setTimeout,
    clearTimeout,
    Date,
    Math,
    Map,
    Promise,
  });

  return { context, elements };
}

async function loadApp(fetchImpl) {
  let source = await fs.readFile(new URL("../app.js", import.meta.url), "utf8");
  source = source.replace("loadCatalogs().catch(handleError);", "");
  source += "\nglobalThis.__RSVP_TEST__ = { state, loadChapterAt, startCourse, startPlayback, openLibrary, render };\n";

  const harness = makeHarness(fetchImpl);
  new vm.Script(source, { filename: "app.js" }).runInContext(harness.context);

  return {
    ...harness,
    api: harness.context.__RSVP_TEST__,
  };
}

function lesson(id) {
  return {
    id,
    title: id.toUpperCase(),
    base_duration_ms: 650,
    sources: [],
    chunks: [{ text: id, duration_multiplier: 1 }],
  };
}

function okResponse(body) {
  return {
    ok: true,
    status: 200,
    async json() { return body; },
  };
}

function deferredFetch() {
  const requests = [];
  const fetchImpl = (path) => new Promise((resolve, reject) => {
    requests.push({ path, resolve, reject });
  });
  return { fetchImpl, requests };
}

test("newer course selection wins when chapter responses finish out of order", async () => {
  const pending = deferredFetch();
  const { api } = await loadApp(pending.fetchImpl);

  api.state.courses = [
    { id: "A", chapters: ["a"] },
    { id: "B", chapters: ["b"] },
  ];
  api.state.lessonMap = new Map([
    ["a", { id: "a", path: "/a.json" }],
    ["b", { id: "b", path: "/b.json" }],
  ]);

  const loadA = api.startCourse("A");
  const loadB = api.startCourse("B");

  pending.requests.find((item) => item.path === "/b.json").resolve(okResponse(lesson("b")));
  assert.equal(await loadB, true);

  pending.requests.find((item) => item.path === "/a.json").resolve(okResponse(lesson("a")));
  assert.equal(await loadA, false);

  assert.equal(api.state.courseId, "B");
  assert.equal(api.state.lessonId, "b");
  assert.deepEqual([...api.state.sequence], ["b"]);
});

test("failure from a stale request does not replace the current lesson with an error", async () => {
  const pending = deferredFetch();
  const { api, elements } = await loadApp(pending.fetchImpl);

  api.state.courses = [
    { id: "A", chapters: ["a"] },
    { id: "B", chapters: ["b"] },
  ];
  api.state.lessonMap = new Map([
    ["a", { id: "a", path: "/a.json" }],
    ["b", { id: "b", path: "/b.json" }],
  ]);

  const loadA = api.startCourse("A");
  const loadB = api.startCourse("B");

  pending.requests.find((item) => item.path === "/b.json").resolve(okResponse(lesson("b")));
  await loadB;

  pending.requests.find((item) => item.path === "/a.json").reject(new Error("late failure"));
  assert.equal(await loadA, false);

  assert.equal(api.state.lessonId, "b");
  assert.equal(elements.get("#chunk-text").textContent, "b");
});

test("a failed current course load leaves the previous course selection intact", async () => {
  const fetchImpl = async () => ({ ok: false, status: 500, async json() { return {}; } });
  const { api } = await loadApp(fetchImpl);

  api.state.courses = [
    { id: "A", chapters: ["a"] },
    { id: "B", chapters: ["b"] },
  ];
  api.state.lessonMap = new Map([
    ["a", { id: "a", path: "/a.json" }],
    ["b", { id: "b", path: "/b.json" }],
  ]);
  api.state.courseId = "A";
  api.state.mode = "chapter";
  api.state.sequence = ["a"];
  api.state.sequenceIndex = 0;
  api.state.lessonId = "a";
  api.state.lesson = lesson("a");

  await assert.rejects(api.startCourse("B"), /教材の取得に失敗しました: 500/);

  assert.equal(api.state.courseId, "A");
  assert.equal(api.state.lessonId, "a");
  assert.deepEqual([...api.state.sequence], ["a"]);
});

test("opening the library pauses playback and clears the scheduled timer", async () => {
  const { api, elements } = await loadApp(async () => okResponse(lesson("a")));

  api.state.lessonId = "a";
  api.state.lesson = {
    ...lesson("a"),
    chunks: [
      { text: "first", duration_multiplier: 1 },
      { text: "second", duration_multiplier: 1 },
    ],
  };

  api.startPlayback();
  assert.equal(api.state.playing, true);
  assert.notEqual(api.state.timer, null);

  api.openLibrary();

  assert.equal(api.state.playing, false);
  assert.equal(api.state.timer, null);
  assert.equal(elements.get("#library-overlay").hidden, false);
});

test("opening the library invalidates an in-flight autoplay chapter load", async () => {
  const pending = deferredFetch();
  const { api } = await loadApp(pending.fetchImpl);

  api.state.courses = [{ id: "A", chapters: ["a", "b"] }];
  api.state.lessonMap = new Map([
    ["a", { id: "a", path: "/a.json" }],
    ["b", { id: "b", path: "/b.json" }],
  ]);
  api.state.courseId = "A";
  api.state.mode = "all";
  api.state.sequence = ["a", "b"];
  api.state.sequenceIndex = 0;
  api.state.lessonId = "a";
  api.state.lesson = lesson("a");

  const next = api.loadChapterAt(1, { autoplay: true });
  api.openLibrary();

  pending.requests.find((item) => item.path === "/b.json").resolve(okResponse(lesson("b")));

  assert.equal(await next, false);
  assert.equal(api.state.lessonId, "a");
  assert.equal(api.state.sequenceIndex, 0);
  assert.equal(api.state.playing, false);
});


test("Learn link stays available and follows the selected lesson when possible", async () => {
  const { api, elements } = await loadApp(async () => okResponse({}));
  api.state.lessonMap = new Map([
    ["complete", { id: "complete", learn_path: "./learn/complete.html" }],
    ["seed", { id: "seed" }],
  ]);
  api.state.sequence = [];
  api.state.lessonId = "complete";
  api.state.lesson = lesson("complete");
  api.render();
  assert.equal(elements.get("#learn-link").hidden, false);
  assert.equal(elements.get("#learn-link").href, "./learn/complete.html");

  api.state.lessonId = "seed";
  api.state.lesson = lesson("seed");
  api.render();
  assert.equal(elements.get("#learn-link").hidden, false);
  assert.equal(elements.get("#learn-link").href, "./index.html?library=learn");
});
