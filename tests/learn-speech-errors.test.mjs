import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await fs.readFile(new URL("../learn/learn.js", import.meta.url), "utf8");

// DOM and Web Speech are faked here. These tests verify player state and error
// reporting, never actual audio output or an authenticated browser.
function makeReader(speak) {
  const elements = {};
  const newElement = (text = "") => ({
    textContent: text, value: "", disabled: false, dataset: {},
    handlers: {}, children: [], className: "",
    classList: { add() {}, remove() {} },
    addEventListener(type, handler) { this.handlers[type] = handler; },
    setAttribute() {}, scrollIntoView() {}, remove() {},
    prepend() {}, append(child) { this.children.push(child); },
    replaceChildren() { this.children = []; },
    querySelector() { return null; }
  });
  for (const id of [
    "#speech-play", "#speech-pause", "#speech-stop", "#speech-voice",
    "#speech-rate", "#speech-rate-label", "#speech-status", "#speech-reader"
  ]) elements[id] = newElement();
  elements["#speech-rate"].value = "1";
  const paragraphs = [newElement("読み上げ試験用の文章です。"), newElement("第二の段落です。")];
  elements["#learn-article"] = {
    querySelectorAll() { return paragraphs; }
  };
  const top = newElement();
  top.querySelector = () => null;
  elements[".top"] = top;

  const spoken = [];
  const synth = {
    cancelCount: 0,
    cancel() { this.cancelCount++; },
    getVoices() { return []; },
    addEventListener() {}, pause() {}, resume() {},
    speak(utterance) { spoken.push(utterance); speak?.(utterance); }
  };
  class SpeechSynthesisUtterance {
    constructor(text) { this.text = text; }
  }
  const doc = {
    visibilityState: "visible",
    querySelector(selector) {
      assert.ok(selector in elements, "unexpected selector: " + selector);
      return elements[selector];
    },
    createElement() { return newElement(); },
    addEventListener() {}
  };
  const win = { speechSynthesis: synth, SpeechSynthesisUtterance, navigator: {}, addEventListener() {} };
  vm.runInNewContext(source, {
    document: doc, window: win, SpeechSynthesisUtterance,
    setTimeout() {}
  }, { timeout: 1500 });
  return {
    elements, synth, spoken,
    start() { elements["#speech-play"].handlers.click(); },
    stop() { elements["#speech-stop"].handlers.click(); },
    status() { return elements["#speech-status"].textContent; },
    code() { return elements["#speech-status"].dataset.speechError; }
  };
}

test("known speech engine errors stay visible as finite safe codes", () => {
  const page = makeReader();
  page.start();
  const utterance = page.spoken[0];
  utterance.onerror({ error: "voice-unavailable" });
  assert.match(page.status(), /読み上げを開始できませんでした.*voice-unavailable/);
  assert.equal(page.code(), "voice-unavailable");
  assert.equal(page.elements["#speech-pause"].disabled, true);
  assert.equal(page.elements["#speech-stop"].disabled, true);
  assert.equal(page.elements["#speech-reader"].dataset.state, "idle");
});

test("untrusted engine error strings are never inserted into page output", () => {
  const page = makeReader();
  page.start();
  const raw = "<img src=x onerror=alert(1)> token=secret";
  page.spoken[0].onerror({ error: raw });
  assert.equal(page.code(), "unknown");
  assert.ok(!page.status().includes(raw));
  assert.match(page.status(), /unknown/);
});

test("synchronous speech API failure records a safe NotAllowedError code", () => {
  const page = makeReader(() => {
    const error = new Error("do not expose this secret detail");
    error.name = "NotAllowedError";
    throw error;
  });
  assert.doesNotThrow(() => page.start());
  assert.equal(page.code(), "not-allowed");
  assert.equal(page.elements["#speech-reader"].dataset.state, "idle");
  assert.ok(!page.status().includes("secret detail"));
});

test("unexpected synchronous exceptions are classified unknown", () => {
  const page = makeReader(() => { throw Error("engine details must not leak"); });
  page.start();
  assert.equal(page.code(), "unknown");
  assert.ok(!page.status().includes("engine details"));
});

test("speech error after actual onstart is not mislabeled start failure", () => {
  const page = makeReader();
  page.start();
  page.spoken[0].onstart();
  page.spoken[0].onerror({ error: "network" });
  assert.equal(page.code(), "network");
  assert.match(page.status(), /^読み上げ中にエラーが発生しました/);
});

test("stale callbacks after stop cannot overwrite idle status or diagnostics", () => {
  const page = makeReader();
  page.start();
  const oldUtterance = page.spoken[0];
  page.stop();
  oldUtterance.onerror({ error: "network" });
  assert.equal(page.status(), "停止しました");
  assert.equal(page.code(), undefined);
});

test("restart clears previous errors and cancelled events do not produce false failures", () => {
  const page = makeReader();
  page.start();
  page.spoken[0].onerror({ error: "audio-busy" });
  assert.equal(page.code(), "audio-busy");
  page.start();
  assert.equal(page.code(), undefined);
  page.spoken[1].onerror({ error: "canceled" });
  assert.equal(page.code(), undefined);
  assert.equal(page.elements["#speech-reader"].dataset.state, "playing");
});
