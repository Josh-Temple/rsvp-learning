import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

function makeElement(textContent = "") {
  const events = new Map();
  const classes = new Set();
  return {
    textContent,
    value: "",
    disabled: false,
    dataset: {},
    options: [],
    scrollCalls: 0,
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); },
    },
    addEventListener(name, callback) { events.set(name, callback); },
    // HTMLElement exposes querySelector even when this focused player fixture has no nested row.
    querySelector() { return null; },
    setAttribute() {},
    replaceChildren(...items) {
      this.options = [...items];
      if (!items.some((item) => item.value === this.value)) this.value = items.find((item) => item.selected)?.value ?? "";
    },
    append(item) {
      this.options.push(item);
      if (item.selected || (!this.value && this.options.length === 1)) this.value = item.value;
    },
    scrollIntoView() { this.scrollCalls += 1; },
    click() { events.get("click")?.({ target: this }); },
    dispatch(name) { events.get(name)?.({ target: this }); },
  };
}

async function setupPlayer() {
  const articleItems = [makeElement("教材タイトル"), makeElement("基本の見出し"), makeElement("説明段落")];
  const selectors = new Map();
  const get = (selector) => {
    if (!selectors.has(selector)) selectors.set(selector, makeElement());
    return selectors.get(selector);
  };
  const article = get("#learn-article");
  article.querySelectorAll = () => articleItems;
  const voices = [
    { voiceURI: "ja-default", name: "Japanese", lang: "ja-JP" },
    { voiceURI: "ja-alternate", name: "Japanese 2", lang: "ja-JP" },
  ];
  const utterances = [];
  const synthEvents = new Map();
  const calls = { cancel: 0, pause: 0, resume: 0 };
  const wakeLockState = { request: 0, release: 0 };
  const wakeLockListeners = new Map();
  const wakeLock = {
    addEventListener(name, callback) { wakeLockListeners.set(name, callback); },
    async release() { wakeLockState.release += 1; wakeLockListeners.get("release")?.(); },
  };
  const wakeLockApi = {
    async request(type) {
      assert.equal(type, "screen");
      wakeLockState.request += 1;
      return wakeLock;
    },
  };
  const speechSynthesis = {
    getVoices: () => voices,
    speak(utterance) { utterances.push(utterance); },
    cancel() { calls.cancel += 1; },
    pause() { calls.pause += 1; },
    resume() { calls.resume += 1; },
    addEventListener(name, callback) { synthEvents.set(name, callback); },
  };
  const windowEvents = new Map();
  class MockUtterance {
    constructor(text) { this.text = text; }
  }
  const document = {
    querySelector: get,
    createElement: () => makeElement(),
  };
  const context = vm.createContext({
    document,
    window: {
      speechSynthesis,
      SpeechSynthesisUtterance: MockUtterance,
      navigator: { wakeLock: wakeLockApi },
      addEventListener(name, callback) { windowEvents.set(name, callback); },
    },
    SpeechSynthesisUtterance: MockUtterance,
    setTimeout() { return 1; },
  });
  const js = await fs.readFile(new URL("../learn/learn.js", import.meta.url), "utf8");
  new vm.Script(js, { filename: "learn.js" }).runInContext(context);
  return { elements: selectors, articleItems, utterances, calls, windowEvents, synthEvents, wakeLockState };
}

test("voice list refresh preserves a selected Japanese voice", async () => {
  const { elements, synthEvents, utterances } = await setupPlayer();
  const voice = elements.get("#speech-voice");
  voice.value = "ja-alternate";
  synthEvents.get("voiceschanged")();
  assert.equal(voice.value, "ja-alternate");
  elements.get("#speech-play").click();
  assert.equal(utterances[0].voice.voiceURI, "ja-alternate");
});

test("player reads DOM order and pause voice change resumes the same element with the new voice", async () => {
  const { elements, articleItems, utterances, calls, windowEvents, wakeLockState } = await setupPlayer();
  const play = elements.get("#speech-play");
  const pause = elements.get("#speech-pause");
  const stop = elements.get("#speech-stop");
  const voice = elements.get("#speech-voice");
  const rate = elements.get("#speech-rate");

  assert.equal(elements.get("#speech-reader").dataset.state, "idle");
  play.click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(wakeLockState.request, 1);
  assert.equal(utterances[0].text, "教材タイトル");
  assert.equal(utterances[0].voice.voiceURI, "ja-default");
  utterances[0].onstart();
  assert.equal(articleItems[0].classList.contains("speech-active"), true);
  assert.equal(articleItems[0].scrollCalls, 1);

  utterances[0].onend();
  assert.equal(utterances[1].text, "基本の見出し");
  rate.value = "4";
  rate.dispatch("input");
  assert.equal(elements.get("#speech-rate-label").textContent, "4.0×");

  pause.click();
  assert.equal(wakeLockState.release, 0);
  assert.equal(elements.get("#speech-reader").dataset.state, "paused");
  assert.equal(calls.pause, 1);
  const countWhilePaused = utterances.length;
  voice.value = "ja-alternate";
  voice.dispatch("change");
  assert.equal(utterances.length, countWhilePaused);

  play.click();
  assert.equal(calls.cancel, 2);
  assert.equal(utterances.length, countWhilePaused + 1);
  assert.equal(utterances.at(-1).text, "基本の見出し");
  assert.equal(utterances.at(-1).voice.voiceURI, "ja-alternate");
  assert.equal(utterances.at(-1).rate, 4);
  assert.equal(elements.get("#speech-reader").dataset.state, "playing");
  utterances.at(-1).onstart();
  assert.equal(articleItems[1].classList.contains("speech-active"), true);

  stop.click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(wakeLockState.release, 1);
  assert.equal(elements.get("#speech-reader").dataset.state, "idle");
  assert.equal(articleItems[1].classList.contains("speech-active"), false);
  const beforeUnloadCount = calls.cancel;
  windowEvents.get("beforeunload")();
  assert.equal(calls.cancel, beforeUnloadCount + 1);
});
