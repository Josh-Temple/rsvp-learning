const THEME_KEY = "rsvp:theme";
const SPEED_KEY = "rsvp:speed";
const LESSON_KEY = "rsvp:last-lesson";
const COURSE_KEY = "rsvp:last-course";
const PROGRESS_KEY = "rsvp:progress:v1";

const savedSpeed = Number(localStorage.getItem(SPEED_KEY));

const state = {
  catalog: [],
  courses: [],
  lessonMap: new Map(),
  lesson: null,
  lessonId: null,
  courseId: null,
  sequence: [],
  sequenceIndex: 0,
  mode: "chapter",
  index: 0,
  playing: false,
  timer: null,
  speed: Number.isFinite(savedSpeed) && savedSpeed >= 0.6 && savedSpeed <= 10 ? savedSpeed : 1,
  progress: loadProgress(),
  playCounted: false,
  completionCounted: false,
  loadRequestId: 0,
};

const els = {
  libraryOpen: document.querySelector("#library-open"),
  libraryClose: document.querySelector("#library-close"),
  libraryOverlay: document.querySelector("#library-overlay"),
  libraryContent: document.querySelector("#library-content"),
  currentLesson: document.querySelector("#current-lesson"),
  learnLink: document.querySelector("#learn-link"),
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
  prevChapter: document.querySelector("#prev-chapter"),
  nextChapter: document.querySelector("#next-chapter"),
  chapterPosition: document.querySelector("#chapter-position"),
  masteryControl: document.querySelector("#mastery-control"),
};

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function getProgress(lessonId) {
  return state.progress[lessonId] ?? {
    mastery: 0,
    plays: 0,
    completions: 0,
    lastPlayedAt: null,
  };
}

function patchProgress(lessonId, patch) {
  state.progress[lessonId] = {
    ...getProgress(lessonId),
    ...patch,
  };
  saveProgress();
}

function setMastery(lessonId, mastery) {
  const level = Math.max(0, Math.min(3, Number(mastery) || 0));
  patchProgress(lessonId, { mastery: level, lastPlayedAt: new Date().toISOString() });
  renderMastery();
  renderLibrary();
}

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

function clearTimer() {
  clearTimeout(state.timer);
  state.timer = null;
}

function stopPlayback() {
  state.playing = false;
  clearTimer();
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

function currentCourse() {
  return state.courses.find((course) => course.id === state.courseId) ?? null;
}

function modeLabel() {
  if (state.mode === "all") return "ALL";
  if (state.mode === "random") return "RND";
  return "ONE";
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

function renderMastery() {
  const mastery = state.lessonId ? getProgress(state.lessonId).mastery : 0;
  for (const button of els.masteryControl.querySelectorAll("button")) {
    const level = Number(button.dataset.level);
    button.classList.toggle("is-filled", level <= mastery);
    button.setAttribute("aria-pressed", level === mastery ? "true" : "false");
  }
}

function renderChapterNav() {
  const total = state.sequence.length;
  const current = Math.min(state.sequenceIndex + 1, total || 1);
  els.chapterPosition.textContent = `${String(current).padStart(2, "0")} / ${String(total || 1).padStart(2, "0")} · ${modeLabel()}`;
  els.prevChapter.disabled = state.sequenceIndex <= 0;
  els.nextChapter.disabled = state.sequenceIndex >= total - 1;
  renderMastery();
}

function render() {
  if (!state.lesson) return;

  const total = state.lesson.chunks.length;
  const chunk = currentChunk();
  const current = Math.min(state.index + 1, total);

  els.currentLesson.textContent = state.lesson.title;
  els.learnLink.hidden = state.lessonId !== "api-authentication-authorization";
  els.chunkText.textContent = chunk?.text ?? "完了";
  els.progressText.textContent = total ? `${current}·${total}` : "0·0";
  els.progressBar.style.width = total ? `${(current / total) * 100}%` : "0%";
  els.speedLabel.textContent = `${state.speed.toFixed(1)}×`;
  els.speed.value = String(state.speed);
  renderSources();
  renderChapterNav();
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

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function markPlayStarted() {
  if (!state.lessonId || state.playCounted) return;
  const progress = getProgress(state.lessonId);
  patchProgress(state.lessonId, {
    plays: progress.plays + 1,
    lastPlayedAt: new Date().toISOString(),
  });
  state.playCounted = true;
}

function markCompleted() {
  if (!state.lessonId || state.completionCounted) return;
  const progress = getProgress(state.lessonId);
  patchProgress(state.lessonId, {
    completions: progress.completions + 1,
    lastPlayedAt: new Date().toISOString(),
  });
  state.completionCounted = true;
  renderLibrary();
}

async function loadChapterAt(
  sequenceIndex,
  {
    autoplay = false,
    courseId = state.courseId,
    mode = state.mode,
    sequence = state.sequence,
  } = {},
) {
  const targetSequence = [...sequence];
  const lessonId = targetSequence[sequenceIndex];
  const meta = state.lessonMap.get(lessonId);
  if (!meta) throw new Error(`教材が見つかりません: ${lessonId}`);

  const requestId = ++state.loadRequestId;
  stopPlayback();

  let lesson;
  try {
    const response = await fetch(meta.path);
    if (!response.ok) throw new Error(`教材の取得に失敗しました: ${response.status}`);
    lesson = await response.json();
    validateLesson(lesson);
  } catch (error) {
    if (requestId !== state.loadRequestId) return false;
    throw error;
  }

  if (requestId !== state.loadRequestId) return false;

  state.courseId = courseId;
  state.mode = mode;
  state.sequence = targetSequence;
  state.lesson = lesson;
  state.lessonId = lessonId;
  state.sequenceIndex = sequenceIndex;
  state.index = 0;
  state.playCounted = false;
  state.completionCounted = false;

  localStorage.setItem(LESSON_KEY, lessonId);
  if (courseId) localStorage.setItem(COURSE_KEY, courseId);

  render();

  if (autoplay && els.libraryOverlay.hidden) {
    startPlayback();
  }

  return true;
}

async function startCourse(courseId, mode = "chapter", lessonId = null) {
  const course = state.courses.find((item) => item.id === courseId);
  if (!course) throw new Error(`コースが見つかりません: ${courseId}`);

  const sequence = mode === "random" ? shuffle(course.chapters) : [...course.chapters];

  let index = 0;
  if (lessonId && mode === "chapter") {
    const found = sequence.indexOf(lessonId);
    if (found >= 0) index = found;
  }

  const loaded = await loadChapterAt(index, {
    courseId: course.id,
    mode,
    sequence,
  });

  if (loaded) closeLibrary();
  return loaded;
}

async function finishCurrentChapter() {
  markCompleted();

  const autoAdvance = state.mode === "all" || state.mode === "random";
  if (autoAdvance && state.sequenceIndex < state.sequence.length - 1) {
    try {
      await loadChapterAt(state.sequenceIndex + 1, { autoplay: true });
    } catch (error) {
      handleError(error);
    }
    return;
  }

  stopPlayback();
}

function scheduleNext() {
  if (!state.playing || !state.lesson) return;

  state.timer = setTimeout(async () => {
    if (!state.playing || !state.lesson) return;

    if (state.index < state.lesson.chunks.length - 1) {
      state.index += 1;
      render();
      scheduleNext();
      return;
    }

    await finishCurrentChapter();
  }, chunkDelayMs());
}

function startPlayback() {
  if (!state.lesson || state.playing) return;

  if (state.index >= state.lesson.chunks.length - 1 && state.completionCounted) {
    state.index = 0;
    state.completionCounted = false;
    state.playCounted = false;
    render();
  }

  markPlayStarted();
  state.playing = true;
  updatePlayButton();
  scheduleNext();
}

function togglePlayback() {
  if (!state.lesson) return;
  if (state.playing) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

function move(delta) {
  if (!state.lesson) return;
  stopPlayback();
  const last = state.lesson.chunks.length - 1;
  state.index = Math.min(last, Math.max(0, state.index + delta));
  render();
}

async function moveChapter(delta) {
  const next = state.sequenceIndex + delta;
  if (next < 0 || next >= state.sequence.length) return;

  try {
    await loadChapterAt(next);
  } catch (error) {
    handleError(error);
  }
}

function masteryMini(level) {
  const span = document.createElement("span");
  span.className = "mastery-mini";
  span.setAttribute("aria-label", `習熟度 ${level} / 3`);

  for (let i = 1; i <= 3; i += 1) {
    const bar = document.createElement("i");
    bar.classList.toggle("is-filled", i <= level);
    span.append(bar);
  }
  return span;
}

function courseMastery(course) {
  if (!course.chapters.length) return 0;
  const total = course.chapters.reduce((sum, lessonId) => sum + getProgress(lessonId).mastery, 0);
  return Math.round(total / course.chapters.length);
}

function renderLibrary() {
  if (!els.libraryContent) return;
  els.libraryContent.replaceChildren();

  for (const course of state.courses) {
    const block = document.createElement("section");
    block.className = "course-block";

    const head = document.createElement("div");
    head.className = "course-head";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "course-title";
    title.textContent = course.title;
    titleWrap.append(title);
    titleWrap.append(masteryMini(courseMastery(course)));

    const modes = document.createElement("div");
    modes.className = "library-mode";

    const all = document.createElement("button");
    all.type = "button";
    all.textContent = "ALL";
    all.addEventListener("click", () => {
      startCourse(course.id, "all").catch(handleError);
    });

    const random = document.createElement("button");
    random.type = "button";
    random.textContent = "RND";
    random.addEventListener("click", () => {
      startCourse(course.id, "random").catch(handleError);
    });

    modes.append(all, random);
    head.append(titleWrap, modes);

    const list = document.createElement("div");
    list.className = "chapter-list";

    course.chapters.forEach((lessonId, index) => {
      const meta = state.lessonMap.get(lessonId);
      if (!meta) return;

      const row = document.createElement("button");
      row.className = "chapter-row";
      row.type = "button";
      row.addEventListener("click", () => {
        startCourse(course.id, "chapter", lessonId).catch(handleError);
      });

      const number = document.createElement("span");
      number.className = "chapter-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const text = document.createElement("span");
      text.className = "chapter-title";
      text.textContent = meta.title;

      row.append(number, text, masteryMini(getProgress(lessonId).mastery));
      list.append(row);
    });

    block.append(head, list);
    els.libraryContent.append(block);
  }
}

function openLibrary() {
  state.loadRequestId += 1;
  stopPlayback();
  renderLibrary();
  els.libraryOverlay.hidden = false;
  document.body.classList.add("is-library-open");
  els.libraryClose.focus();
}

function closeLibrary() {
  els.libraryOverlay.hidden = true;
  document.body.classList.remove("is-library-open");
}

async function loadCatalogs() {
  const [lessonResponse, courseResponse] = await Promise.all([
    fetch("./lessons/index.json"),
    fetch("./courses/index.json"),
  ]);

  if (!lessonResponse.ok) {
    throw new Error(`教材一覧の取得に失敗しました: ${lessonResponse.status}`);
  }
  if (!courseResponse.ok) {
    throw new Error(`コース一覧の取得に失敗しました: ${courseResponse.status}`);
  }

  const lessonCatalog = await lessonResponse.json();
  const courseCatalog = await courseResponse.json();

  state.catalog = lessonCatalog.lessons ?? [];
  state.courses = courseCatalog.courses ?? [];
  state.lessonMap = new Map(state.catalog.map((item) => [item.id, item]));

  renderLibrary();

  const savedLesson = localStorage.getItem(LESSON_KEY);
  const savedCourse = localStorage.getItem(COURSE_KEY);

  let course = state.courses.find((item) => item.id === savedCourse);
  if (!course && savedLesson) {
    course = state.courses.find((item) => item.chapters.includes(savedLesson));
  }
  if (!course) course = state.courses[0];

  if (!course) throw new Error("コースがありません。");

  const lessonId = savedLesson && course.chapters.includes(savedLesson)
    ? savedLesson
    : course.chapters[0];

  await startCourse(course.id, "chapter", lessonId);
}

function handleError(error) {
  console.error(error);
  stopPlayback();
  els.chunkText.textContent = "読み込みエラー";
}

els.libraryOpen.addEventListener("click", openLibrary);
els.currentLesson.addEventListener("click", openLibrary);
els.libraryClose.addEventListener("click", closeLibrary);
els.libraryOverlay.addEventListener("click", (event) => {
  if (event.target === els.libraryOverlay) closeLibrary();
});

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
  state.playCounted = false;
  state.completionCounted = false;
  render();
});

els.prevChapter.addEventListener("click", () => moveChapter(-1));
els.nextChapter.addEventListener("click", () => moveChapter(1));

for (const button of els.masteryControl.querySelectorAll("button")) {
  button.addEventListener("click", () => {
    if (!state.lessonId) return;
    const level = Number(button.dataset.level);
    const current = getProgress(state.lessonId).mastery;
    setMastery(state.lessonId, current === level ? 0 : level);
  });
}

els.speed.addEventListener("input", (event) => {
  state.speed = Number(event.target.value);
  localStorage.setItem(SPEED_KEY, String(state.speed));

  if (state.playing) {
    clearTimer();
  }

  render();
  if (state.playing) scheduleNext();
});

document.addEventListener("keydown", (event) => {
  if (!els.libraryOverlay.hidden && event.key === "Escape") {
    closeLibrary();
    return;
  }

  if (event.target.matches("input, button")) return;

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

loadCatalogs().catch(handleError);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
