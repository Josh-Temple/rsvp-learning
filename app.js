const THEME_KEY = "rsvp:theme";
const SPEED_KEY = "rsvp:speed";
const LESSON_KEY = "rsvp:last-lesson";

const savedSpeed = Number(localStorage.getItem(SPEED_KEY));

const state = {
  catalog: [],
  lesson: null,
  index: 0,
  playing: false,
  timer: null,
  speed: Number.isFinite(savedSpeed) && savedSpeed >= 0.6 && savedSpeed <= 10 ? savedSpeed : 1,
};

const els = {
  lessonSelect: document.querySelector("#lesson-select"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeColor: document.querySelector("#theme-color"),
  chunkStage: document.querySelector("#chunk-stage"),
  chunkText: document.querySelector("#chunk-text"),
  progressText: document.querySelector("#progress-text"),
  progressBar: document.querySelector("#progress-bar"),
  playPause: document.querySelector("#play-pause"),
  backFive: document.querySelector("#back-five"),
  backOne: document.querySelector("#back-one"),
  nextOne: document.querySelector("#next-one"),
  restart: document.querySelector("#restart"),
  speed: document.querySelector("#speed"),
  speedLabel: document.querySelector("#speed-label"),
  sourceSection: document.querySelector("#source-section"),
  sourceList: document.querySelector("#source-list"),
};

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme, persist = true) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  els.themeToggle.textContent = next === "dark" ? "☀" : "☾";
  els.themeToggle.setAttribute(
    "aria-label",
    next === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え",
  );
  els.themeColor.setAttribute("content", next === "dark" ? "#11151a" : "#f2efe8");
  if (persist) localStorage.setItem(THEME_KEY, next);
}

function updatePlayButton() {
  els.playPause.textContent = state.playing ? "Ⅱ" : "▶";
  els.playPause.setAttribute("aria-label", state.playing ? "一時停止" : "再生");
}

function stopPlayback() {
  state.playing = false;
  clearTimeout(state.timer);
  state.timer = null;
  updatePlayButton();
}

function currentChunk() {
  return state.lesson?.chunks?.[state.index] ?? null;
}

function chunkDelayMs() {
  const chunk = currentChunk();
  const base = state.lesson?.base_duration_ms ?? 650;
  const multiplier = chunk?.duration_multiplier ?? 1;
  return Math.max(50, Math.round((base * multiplier) / state.speed));
}

function renderSources() {
  const sources = state.lesson?.sources ?? [];
  els.sourceList.replaceChildren();
  els.sourceSection.hidden = sources.length === 0;

  for (const source of sources) {
    const li = document.createElement("li");
    if (source.url) {
      const a = document.createElement("a");
      a.href = source.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = source.title ?? source.url;
      li.append(a);
    } else {
      li.textContent = source.title ?? "出典";
    }
    els.sourceList.append(li);
  }
}

function render() {
  if (!state.lesson) return;

  const total = state.lesson.chunks.length;
  const chunk = currentChunk();
  const current = Math.min(state.index + 1, total);

  els.chunkText.textContent = chunk?.text ?? "完了";
  els.progressText.textContent = total ? `${current}·${total}` : "0·0";
  els.progressBar.style.width = total ? `${(current / total) * 100}%` : "0%";
  els.speedLabel.textContent = `${state.speed.toFixed(1)}×`;
  els.speed.value = String(state.speed);
  renderSources();
}

function scheduleNext() {
  if (!state.playing || !state.lesson) return;

  if (state.index >= state.lesson.chunks.length - 1) {
    stopPlayback();
    return;
  }

  state.timer = setTimeout(() => {
    state.index += 1;
    render();
    scheduleNext();
  }, chunkDelayMs());
}

function togglePlayback() {
  if (!state.lesson) return;

  if (state.playing) {
    stopPlayback();
    return;
  }

  if (state.index >= state.lesson.chunks.length - 1) {
    state.index = 0;
    render();
  }

  state.playing = true;
  updatePlayButton();
  scheduleNext();
}

function move(delta) {
  if (!state.lesson) return;
  stopPlayback();
  const last = state.lesson.chunks.length - 1;
  state.index = Math.min(last, Math.max(0, state.index + delta));
  render();
}

function validateLesson(lesson) {
  if (!lesson || typeof lesson !== "object") throw new Error("教材JSONが不正です。");
  if (!lesson.title || !Array.isArray(lesson.chunks) || lesson.chunks.length === 0) {
    throw new Error("title または chunks がありません。");
  }
  for (const chunk of lesson.chunks) {
    if (!chunk.text || typeof chunk.text !== "string") {
      throw new Error("text のないチャンクがあります。");
    }
  }
}

async function loadLesson(path) {
  stopPlayback();
  const response = await fetch(path);
  if (!response.ok) throw new Error(`教材の取得に失敗しました: ${response.status}`);
  const lesson = await response.json();
  validateLesson(lesson);
  state.lesson = lesson;
  state.index = 0;
  localStorage.setItem(LESSON_KEY, path);
  render();
}

async function loadCatalog() {
  const response = await fetch("./lessons/index.json");
  if (!response.ok) throw new Error(`教材一覧の取得に失敗しました: ${response.status}`);
  const catalog = await response.json();
  state.catalog = catalog.lessons ?? [];

  els.lessonSelect.replaceChildren();
  for (const item of state.catalog) {
    const option = document.createElement("option");
    option.value = item.path;
    option.textContent = item.title;
    els.lessonSelect.append(option);
  }

  if (state.catalog.length > 0) {
    const savedLesson = localStorage.getItem(LESSON_KEY);
    const selected = state.catalog.some((item) => item.path === savedLesson)
      ? savedLesson
      : state.catalog[0].path;
    els.lessonSelect.value = selected;
    await loadLesson(selected);
  }
}

els.lessonSelect.addEventListener("change", (event) => loadLesson(event.target.value));
els.themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});
els.chunkStage.addEventListener("click", togglePlayback);
els.playPause.addEventListener("click", togglePlayback);
els.backFive.addEventListener("click", () => move(-5));
els.backOne.addEventListener("click", () => move(-1));
els.nextOne.addEventListener("click", () => move(1));
els.restart.addEventListener("click", () => {
  stopPlayback();
  state.index = 0;
  render();
});
els.speed.addEventListener("input", (event) => {
  state.speed = Number(event.target.value);
  localStorage.setItem(SPEED_KEY, String(state.speed));
  if (state.playing) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  render();
  if (state.playing) scheduleNext();
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("select, input, button")) return;
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  } else if (event.key === "ArrowLeft") {
    move(-1);
  } else if (event.key === "ArrowRight") {
    move(1);
  }
});

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
colorScheme.addEventListener?.("change", (event) => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(event.matches ? "dark" : "light", false);
  }
});

applyTheme(currentTheme(), false);
updatePlayButton();

loadCatalog().catch((error) => {
  console.error(error);
  els.chunkText.textContent = "読み込みエラー";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
