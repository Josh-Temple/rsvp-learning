import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../learn/course-player.js", import.meta.url), "utf8");

function makePage({ speechSupported = true, throwFromSpeak = null } = {}) {
  class Element {
    constructor(text = "") {
      this.textContent = text;
      this.value = "";
      this.hidden = false;
      this.disabled = false;
      this.dataset = {};
      this.children = [];
      this.handlers = new Map();
      this.classList = { add() {}, remove() {} };
    }
    addEventListener(name, handler) {
      const list = this.handlers.get(name) || [];
      list.push(handler);
      this.handlers.set(name, list);
    }
    emit(name, event = {}) {
      for (const handler of this.handlers.get(name) || []) handler(event);
    }
    setAttribute() {}
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = [...children]; }
    before() {}
    scrollIntoView() {}
    querySelector() { return null; }
    querySelectorAll() { return []; }
  }

  const selectors = [
    "#learn-course-player", "#library-overlay", "#learn-course-back",
    "#learn-course-title", "#learn-course-position", "#learn-course-article",
    "#learn-course-sources", "#learn-course-reader", "#learn-course-play",
    "#learn-course-pause", "#learn-course-stop", "#learn-course-prev",
    "#learn-course-next", "#learn-course-voice", "#learn-course-rate",
    "#learn-course-rate-label", "#learn-course-status"
  ];
  const els = Object.fromEntries(selectors.map((s) => [s, new Element()]));
  const articleItem = new Element("読み上げテスト用の段落です。");
  els["#learn-course-article"].querySelectorAll = (q) =>
    q === "h1, h2, h3, p" ? [articleItem] : [];
  els["#learn-course-article"].querySelector = (q) =>
    q === "h1" ? articleItem : null;
  els["#learn-course-rate"].value = "1";
  const documentEvents = new Element();
  const document = {
    body: { classList: { add() {}, remove() {} } },
    querySelector(q) { return els[q] || null; },
    createElement() { return new Element(); },
    addEventListener(name, callback) { documentEvents.addEventListener(name, callback); }
  };

  const values = new Map();
  const localStorage = {
    getItem(k) { return values.get(k) ?? null; },
    setItem(k, v) { values.set(k, String(v)); },
    removeItem(k) { values.delete(k); }
  };
  const spoken = [];
  const synth = {
    getVoices() { return []; },
    addEventListener() {},
    cancel() {},
    pause() {},
    resume() {},
    speak(utterance) {
      spoken.push(utterance);
      if (throwFromSpeak) throw throwFromSpeak;
    }
  };
  class Utterance { constructor(text) { this.text = text; } }
  const window = { navigator: {}, addEventListener() {} };
  if (speechSupported) {
    window.speechSynthesis = synth;
    window.SpeechSynthesisUtterance = Utterance;
  }

  class DOMParser {
    parseFromString() {
      return {
        querySelector(q) {
          return q === "#learn-article" ? { innerHTML: "<p>読み上げテスト用の段落です。</p>" } : null;
        }
      };
    }
  }
  const fetch = async (url) => {
    if (url === "./courses/index.json")
      return { ok: true, json: async () => ({ courses: [{ id: "c1", title: "Course", chapters: ["l1"] }] }) };
    if (url === "./lessons/index.json")
      return { ok: true, json: async () => ({ lessons: [{ id: "l1", title: "Lesson", learn_path: "./learn/l1.html" }] }) };
    return { ok: true, text: async () => "<article></article>" };
  };
  new Function("document", "window", "localStorage", "fetch",
    "SpeechSynthesisUtterance", "DOMParser", "setTimeout", source)(
    document, window, localStorage, fetch, Utterance, DOMParser, () => {}
  );
  return {
    els, spoken, localStorage,
    start() {
      documentEvents.emit("click", {
        target: { closest(sel) { return sel === ".learn-course-play" ? { dataset: { courseId: "c1" } } : null; } }
      });
    },
    click(id) { els[id].emit("click"); },
    status() { return els["#learn-course-status"].textContent; },
    error() { return els["#learn-course-status"].dataset.speechError; },
    state() { return els["#learn-course-reader"].dataset.state; }
  };
}

async function settle() {
  for (let i = 0; i < 12; i++) await Promise.resolve();
}

test("known engine error shows code and keeps saved position", async () => {
  const p = makePage(); p.start(); await settle();
  assert.equal(p.spoken.length, 1);
  const saved = p.localStorage.getItem("rsvp:learn-course-position:v1");
  p.spoken[0].onerror({ error: "voice-unavailable" });
  assert.match(p.status(), /開始できませんでした.*voice-unavailable/);
  assert.equal(p.error(), "voice-unavailable");
  assert.equal(p.state(), "idle");
  assert.equal(p.localStorage.getItem("rsvp:learn-course-position:v1"), saved);
});

test("onstart followed by failure distinguishes mid-playback error", async () => {
  const p = makePage(); p.start(); await settle();
  p.spoken[0].onstart();
  p.spoken[0].onerror({ error: "audio-busy" });
  assert.match(p.status(), /読み上げ中にエラー.*audio-busy/);
  assert.equal(p.error(), "audio-busy");
});

test("untrusted speech engine strings cannot leak into UI", async () => {
  const p = makePage(); p.start(); await settle();
  const raw = "<img src=x onerror=alert(1)> secret=abcdef";
  p.spoken[0].onerror({ error: raw });
  assert.equal(p.error(), "unknown");
  assert.ok(!p.status().includes(raw));
});

test("synchronous NotAllowedError does not break the player", async () => {
  const error = new Error("private engine detail"); error.name = "NotAllowedError";
  const p = makePage({ throwFromSpeak: error });
  p.start(); await settle();
  assert.equal(p.error(), "not-allowed");
  assert.equal(p.state(), "idle");
  assert.ok(!p.status().includes("private engine detail"));
});

test("unexpected synchronous speech error is safely classified", async () => {
  const p = makePage({ throwFromSpeak: new Error("private stack data") });
  p.start(); await settle();
  assert.equal(p.error(), "unknown");
  assert.ok(!p.status().includes("private stack data"));
});

test("cancelled engine event is ignored; stop clears code", async () => {
  const p = makePage(); p.start(); await settle();
  p.spoken[0].onerror({ error: "canceled" });
  assert.equal(p.state(), "playing");
  assert.equal(p.error(), undefined);
  p.spoken[0].onerror({ error: "network" });
  assert.equal(p.error(), "network");
  p.click("#learn-course-stop");
  assert.equal(p.error(), undefined);
  assert.equal(p.state(), "idle");
});

test("retry clears prior diagnostic and stale utterance errors", async () => {
  const p = makePage(); p.start(); await settle();
  const old = p.spoken[0];
  old.onerror({ error: "network" });
  p.click("#learn-course-play");
  assert.equal(p.error(), undefined);
  assert.equal(p.spoken.length, 2);
  old.onerror({ error: "audio-hardware" });
  assert.equal(p.error(), undefined);
  p.spoken[1].onstart();
  assert.equal(p.state(), "playing");
  assert.equal(p.error(), undefined);
});

test("back navigation works even without any Web Speech API", () => {
  const p = makePage({ speechSupported: false });
  assert.equal(p.els["#learn-course-play"].disabled, true);
  assert.doesNotThrow(() => p.click("#learn-course-back"));
  assert.equal(p.els["#learn-course-player"].hidden, true);
  assert.equal(p.els["#library-overlay"].hidden, false);
});
