const state = {
  catalog: [],
  lesson: null,
  index: 0,
  playing: false,
  timer: null,
  speed: 1,
};

const els = {
  lessonSelect: document.querySelector("#lesson-select"),
  lessonTopic: document.querySelector("#lesson-topic"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonSummary: document.querySelector("#lesson-summary"),
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
  timingLabel: document.querySelector("#timing-label"),
  sourceList: document.querySelector("#source-list"),
};

function stopPlayback() {
  state.playing = false;
  clearTimeout(state.timer);
  state.timer = null;
  els.playPause.textContent = "再生";
}

function currentChunk() {
  return state.lesson?.chunks?.[state.index] ?? null;
}

function chunkDelayMs() {
  const chunk = currentChunk();
  const base = state.lesson?.base_duration_ms ?? 650;
  const multiplier = chunk?.duration_multiplier ?? 1;
  return Math.max(120, Math.round((base * multiplier) / state.speed));
}

function render() {
  if (!state.lesson) return;

  const total = state.lesson.chunks.length;
  const chunk = currentChunk();
  els.lessonTopic.textContent = state.lesson.topic ?? "";
  els.lessonTitle.textContent = state.lesson.title;
  els.lessonSummary.textContent = state.lesson.summary ?? "";
  els.chunkText.textContent = chunk?.text ?? "完了";
  els.progressText.textContent = total ? `${Math.min(state.index + 1, total)} / ${total}` : "0 / 0";
  els.progressBar.style.width = total ? `${((state.index + 1) / total) * 100}%` : "0%";
  els.speedLabel.textContent = `${state.speed.toFixed(1)}×`;
  els.timingLabel.textContent = `基本表示時間: ${Math.round((state.lesson.base_duration_ms ?? 650) / state.speed)} ms`;

  els.sourceList.replaceChildren();
  for (const source of state.lesson.sources ?? []) {
    const li = document.createElement("li");
    if (source.url) {
      const a = document.createElement("a");
      a.href = source.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = source.title ?? source.url;
      li.append(a);
    } else {
      li.textContent = source.title ?? "出典情報";
    }
    els.sourceList.append(li);
  }
}

function scheduleNext() {
  if (!state.playing || !state.lesson) return;

  const total = state.lesson.chunks.length;
  if (state.index >= total - 1) {
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
  }

  state.playing = true;
  els.playPause.textContent = "一時停止";
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
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`教材の取得に失敗しました: ${response.status}`);
  const lesson = await response.json();
  validateLesson(lesson);
  state.lesson = lesson;
  state.index = 0;
  render();
}

async function loadCatalog() {
  const response = await fetch("./lessons/index.json", { cache: "no-store" });
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
    await loadLesson(state.catalog[0].path);
  }
}

els.lessonSelect.addEventListener("change", (event) => loadLesson(event.target.value));
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

loadCatalog().catch((error) => {
  console.error(error);
  els.chunkText.textContent = "教材を読み込めませんでした";
  els.lessonTitle.textContent = "読み込みエラー";
  els.lessonSummary.textContent = error.message;
});
