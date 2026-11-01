import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../learn/course-player.js", import.meta.url), "utf8");

function setup(speechAvailable) {
  const elements = new Map();
  const documentEvents = new Map();
  const windowEvents = new Map();
  const classes = new Set();
  const makeElement = () => {
    const listeners = new Map();
    const ownClasses = new Set();
    return {
      hidden: false, value: "", textContent: "", dataset: {}, children: [], disabled: false,
      classList: {
        add: (value) => ownClasses.add(value),
        remove: (value) => ownClasses.delete(value),
      },
      setAttribute() {},
      replaceChildren(...items) { this.children = items; },
      append(...items) { this.children.push(...items); },
      before() {},
      addEventListener(name, callback) { listeners.set(name, callback); },
      click() { listeners.get("click")?.(); },
      querySelectorAll() { return []; },
    };
  };
  const get = (selector) => {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  };
  get("#learn-course-player").hidden = true;
  get("#library-overlay").hidden = false;

  const entries = [{ rsvpLayer: "library" }];
  let current = 0;
  const history = {
    get state() { return entries[current]; },
    pushState(value) {
      entries.splice(current + 1);
      entries.push(value);
      current += 1;
    },
    back() { if (current > 0) { current -= 1; windowEvents.get("popstate")?.(); } },
    forward() { if (current < entries.length - 1) { current += 1; windowEvents.get("popstate")?.(); } },
  };
  const synthesis = speechAvailable ? {
    cancel() {}, getVoices: () => [], addEventListener() {},
  } : undefined;
  const window = {
    history, speechSynthesis: synthesis,
    navigator: {},
    addEventListener(name, callback) { windowEvents.set(name, callback); },
  };
  if (speechAvailable) window.SpeechSynthesisUtterance = class {};

  const document = {
    querySelector: get,
    createElement: makeElement,
    addEventListener(name, callback) { documentEvents.set(name, callback); },
    body: { classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
    } },
  };
  const localStorage = { getItem: () => null, setItem() {} };
  vm.runInNewContext(source, { document, window, localStorage, setTimeout: () => 1 });
  return { get, history, documentEvents };
}

for (const supported of [true, false]) {
  test("Learn course Android Back returns to the list (speech supported: " + supported + ")", () => {
    const { get, history, documentEvents } = setup(supported);
    const button = { dataset: { courseId: "example" } };
    documentEvents.get("click")({ target: { closest: () => button } });
    assert.equal(history.state.rsvpLayer, "course");
    assert.equal(get("#learn-course-player").hidden, false);
    assert.equal(get("#library-overlay").hidden, true);

    get("#learn-course-back").click();
    assert.equal(history.state.rsvpLayer, "library");
    assert.equal(get("#learn-course-player").hidden, true);
    assert.equal(get("#library-overlay").hidden, false);

    history.forward();
    assert.equal(history.state.rsvpLayer, "course");
    assert.equal(get("#learn-course-player").hidden, false);
  });
}
