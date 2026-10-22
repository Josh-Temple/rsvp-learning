(() => {
  const HOST_ID = "rsvp-web-reader-host";
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const selectedText = window.getSelection?.().toString().trim() || "";

  function isUsableElement(element) {
    if (!(element instanceof Element)) return false;
    if (element.closest("nav, header, footer, aside, form, dialog, [aria-hidden='true']")) return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function extractPageText() {
    if (selectedText.length >= 20) {
      return { text: selectedText, sourceLabel: "選択範囲" };
    }

    const root =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.querySelector("[role='main']") ||
      document.body;

    const candidates = [...root.querySelectorAll("h1, h2, h3, p, blockquote, li")]
      .filter(isUsableElement)
      .map((element) => element.innerText.replace(/\s+/g, " ").trim())
      .filter((text) => text.length >= 2);

    const unique = [];
    const seen = new Set();
    for (const text of candidates) {
      if (seen.has(text)) continue;
      seen.add(text);
      unique.push(text);
    }

    const text = unique.length >= 3
      ? unique.join("\n")
      : (root.innerText || document.body.innerText || "").trim();

    return { text, sourceLabel: document.title || location.hostname };
  }

  function splitSentences(text) {
    return text
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\r/g, "")
      .split(/\n+/)
      .flatMap((line) => line.match(/[^。！？!?]+[。！？!?]?/g) || [])
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function segmentWords(text) {
    if (Intl?.Segmenter) {
      return [...new Intl.Segmenter("ja", { granularity: "word" }).segment(text)]
        .map((item) => item.segment)
        .filter(Boolean);
    }
    return [...text];
  }

  function splitClause(clause) {
    const TARGET = 9;
    const MAX = 14;
    const words = segmentWords(clause);
    const chunks = [];
    let current = "";

    for (const word of words) {
      const next = current + word;
      if (current && next.length > MAX && current.length >= 4) {
        chunks.push(current);
        current = word;
        continue;
      }

      current = next;

      const naturalBreak = /[、，,；;：:]$/.test(current);
      if (current.length >= TARGET && naturalBreak) {
        chunks.push(current);
        current = "";
      }
    }

    if (current) chunks.push(current);

    return chunks.flatMap((chunk) => {
      if (chunk.length <= MAX + 4) return [chunk];
      const parts = [];
      for (let index = 0; index < chunk.length; index += MAX) {
        parts.push(chunk.slice(index, index + MAX));
      }
      return parts;
    });
  }

  function makeChunks(text) {
    const chunks = [];
    for (const sentence of splitSentences(text)) {
      const clauses = sentence.match(/[^、，,；;：:]+[、，,；;：:]?/g) || [sentence];
      for (const clause of clauses) {
        for (const chunk of splitClause(clause.trim())) {
          if (chunk.trim()) chunks.push(chunk.trim());
        }
      }
    }
    return chunks;
  }

  function durationMultiplier(text) {
    let multiplier = 0.82 + Math.min(text.length, 18) / 30;
    if (/[。！？!?]$/.test(text)) multiplier += 0.28;
    else if (/[、，,；;：:]$/.test(text)) multiplier += 0.12;
    return Math.min(1.6, Math.max(0.8, multiplier));
  }

  const extracted = extractPageText();
  const chunks = makeChunks(extracted.text);

  if (!chunks.length) {
    alert("RSVPで表示できる本文を取得できませんでした。");
    return;
  }

  const host = document.createElement("div");
  host.id = HOST_ID;
  host.style.position = "fixed";
  host.style.left = "0";
  host.style.right = "0";
  host.style.bottom = "0";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; }
      .panel {
        pointer-events: auto;
        width: min(720px, calc(100vw - 16px));
        margin: 0 auto max(8px, env(safe-area-inset-bottom));
        overflow: hidden;
        border: 1px solid #cbc8bf;
        border-radius: 18px;
        background: #f2efe8;
        color: #121722;
        box-shadow: 0 14px 40px rgba(0,0,0,.24);
        font-family: Inter, "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif;
      }
      .head {
        min-height: 34px;
        padding: 6px 10px 4px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid #e0ddd5;
      }
      .source {
        min-width: 0;
        overflow: hidden;
        color: #73766f;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .close {
        width: 30px;
        height: 30px;
        padding: 0;
        border: 0;
        background: transparent;
        color: #73766f;
        font-size: 20px;
        line-height: 1;
      }
      .stage {
        min-height: 92px;
        padding: 12px 16px 10px;
        display: grid;
        place-items: center;
        border: 0;
        background: transparent;
        color: #121722;
        width: 100%;
      }
      .chunk {
        display: block;
        max-width: 18ch;
        font-size: clamp(28px, 8.6vw, 48px);
        font-weight: 680;
        line-height: 1.08;
        letter-spacing: -.03em;
        text-align: center;
        text-wrap: balance;
      }
      .progress {
        height: 3px;
        background: #e5e1d8;
      }
      .progress > i {
        display: block;
        height: 100%;
        width: 0;
        background: #a85248;
      }
      .dock {
        min-height: 52px;
        padding: 6px 10px 8px;
        display: grid;
        grid-template-columns: auto auto auto 1fr auto;
        align-items: center;
        gap: 6px;
      }
      button {
        font: inherit;
        color: inherit;
        touch-action: manipulation;
      }
      .dock button {
        min-width: 38px;
        height: 38px;
        padding: 0 8px;
        border: 1px solid #cbc8bf;
        background: transparent;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 650;
      }
      .play {
        border-color: #121722 !important;
        background: #121722 !important;
        color: #f2efe8 !important;
      }
      .speed {
        width: 100%;
        min-width: 90px;
        accent-color: #5d7487;
      }
      .meta {
        min-width: 62px;
        color: #73766f;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        text-align: right;
      }
      @media (prefers-color-scheme: dark) {
        .panel { border-color: #343a3e; background: #11151a; color: #edf0eb; }
        .head { border-color: #20262a; }
        .source, .close, .meta { color: #959b97; }
        .stage { color: #edf0eb; }
        .progress { background: #20262a; }
        .progress > i { background: #c36a60; }
        .dock button { border-color: #343a3e; }
        .play { border-color: #edf0eb !important; background: #edf0eb !important; color: #11151a !important; }
      }
    </style>
    <section class="panel" role="dialog" aria-label="RSVP Web Reader">
      <div class="head">
        <div class="source"></div>
        <button class="close" type="button" aria-label="閉じる">×</button>
      </div>
      <button class="stage" type="button" aria-label="再生・一時停止">
        <span class="chunk"></span>
      </button>
      <div class="progress" aria-hidden="true"><i></i></div>
      <div class="dock">
        <button class="back" type="button" aria-label="1チャンク戻る">←</button>
        <button class="play" type="button" aria-label="再生">▶</button>
        <button class="next" type="button" aria-label="1チャンク進む">→</button>
        <input class="speed" type="range" min="0.6" max="10" step="0.1" value="1" aria-label="再生速度" />
        <span class="meta"></span>
      </div>
    </section>
  `;

  document.documentElement.appendChild(host);

  const elements = {
    source: shadow.querySelector(".source"),
    close: shadow.querySelector(".close"),
    stage: shadow.querySelector(".stage"),
    chunk: shadow.querySelector(".chunk"),
    progress: shadow.querySelector(".progress > i"),
    back: shadow.querySelector(".back"),
    play: shadow.querySelector(".play"),
    next: shadow.querySelector(".next"),
    speed: shadow.querySelector(".speed"),
    meta: shadow.querySelector(".meta"),
  };

  const state = {
    index: 0,
    playing: false,
    timer: null,
    speed: 1,
  };

  function clearTimer() {
    clearTimeout(state.timer);
    state.timer = null;
  }

  function render() {
    const current = chunks[state.index] || "";
    elements.chunk.textContent = current;
    elements.progress.style.width = `${((state.index + 1) / chunks.length) * 100}%`;
    elements.meta.textContent = `${state.index + 1}/${chunks.length} · ${state.speed.toFixed(1)}×`;
    elements.play.textContent = state.playing ? "Ⅱ" : "▶";
    elements.play.setAttribute("aria-label", state.playing ? "一時停止" : "再生");
  }

  function pause() {
    state.playing = false;
    clearTimer();
    render();
  }

  function schedule() {
    if (!state.playing) return;
    const current = chunks[state.index] || "";
    const delay = Math.max(
      50,
      Math.round((650 * durationMultiplier(current)) / state.speed),
    );

    state.timer = setTimeout(() => {
      if (!state.playing) return;
      if (state.index >= chunks.length - 1) {
        pause();
        return;
      }
      state.index += 1;
      render();
      schedule();
    }, delay);
  }

  function play() {
    if (state.playing) return;
    if (state.index >= chunks.length - 1) state.index = 0;
    state.playing = true;
    render();
    schedule();
  }

  function toggle() {
    if (state.playing) pause();
    else play();
  }

  function move(delta) {
    pause();
    state.index = Math.max(0, Math.min(chunks.length - 1, state.index + delta));
    render();
  }

  elements.source.textContent = extracted.sourceLabel;
  elements.close.addEventListener("click", () => {
    pause();
    host.remove();
  });
  elements.stage.addEventListener("click", toggle);
  elements.play.addEventListener("click", toggle);
  elements.back.addEventListener("click", () => move(-1));
  elements.next.addEventListener("click", () => move(1));
  elements.speed.addEventListener("input", (event) => {
    state.speed = Number(event.target.value);
    if (state.playing) {
      clearTimer();
      render();
      schedule();
    } else {
      render();
    }
  });

  render();
})();
