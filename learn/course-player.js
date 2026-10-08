(() => {
  const overlay = document.querySelector("#learn-course-player");
  const libraryOverlay = document.querySelector("#library-overlay");
  const backButton = document.querySelector("#learn-course-back");
  const courseTitle = document.querySelector("#learn-course-title");
  const position = document.querySelector("#learn-course-position");
  const article = document.querySelector("#learn-course-article");
  const sources = document.querySelector("#learn-course-sources");
  const reader = document.querySelector("#learn-course-reader");
  const playButton = document.querySelector("#learn-course-play");
  const pauseButton = document.querySelector("#learn-course-pause");
  const stopButton = document.querySelector("#learn-course-stop");
  const prevButton = document.querySelector("#learn-course-prev");
  const nextButton = document.querySelector("#learn-course-next");
  const voiceSelect = document.querySelector("#learn-course-voice");
  const rateInput = document.querySelector("#learn-course-rate");
  const rateLabel = document.querySelector("#learn-course-rate-label");
  const status = document.querySelector("#learn-course-status");

  if (!overlay || !article || !sources || !reader || !playButton || !pauseButton || !stopButton || !voiceSelect || !rateInput || !status) {
    return;
  }

  const synth = window.speechSynthesis;
  const RATE_KEY = "rsvp:learn-course-rate";
  const VOICE_KEY = "rsvp:learn-course-voice";

  let courses = null;
  let lessonMap = null;
  let course = null;
  let sequence = [];
  let chapterIndex = 0;
  let items = [];
  let itemIndex = 0;
  let state = "idle";
  let runId = 0;
  let voices = [];
  let voiceChangedWhilePaused = false;
  let wakeLock = null;
  let wakeLockWanted = false;
  let completed = false;

  const savedRate = Number(localStorage.getItem(RATE_KEY));
  rateInput.value = Number.isFinite(savedRate) && savedRate >= 0.7 && savedRate <= 4 ? String(savedRate) : "1";
  rateLabel.textContent = Number(rateInput.value).toFixed(1) + "×";

  async function loadCatalogs() {
    if (courses && lessonMap) return;
    const responses = await Promise.all([
      fetch("./courses/index.json"),
      fetch("./lessons/index.json"),
    ]);
    if (!responses[0].ok || !responses[1].ok) {
      throw new Error("コース一覧の取得に失敗しました");
    }
    const courseCatalog = await responses[0].json();
    const lessonCatalog = await responses[1].json();
    courses = courseCatalog.courses || [];
    lessonMap = new Map((lessonCatalog.lessons || []).map((item) => [item.id, item]));
  }

  async function requestWakeLock() {
    const wakeLockApi = window.navigator?.wakeLock;
    wakeLockWanted = true;
    if (!wakeLockApi?.request || wakeLock) return;
    try {
      const lock = await wakeLockApi.request("screen");
      if (!wakeLockWanted) {
        await lock.release();
        return;
      }
      wakeLock = lock;
      wakeLock.addEventListener?.("release", () => {
        wakeLock = null;
      });
    } catch {
      wakeLock = null;
    }
  }

  async function releaseWakeLock() {
    wakeLockWanted = false;
    const current = wakeLock;
    wakeLock = null;
    if (!current) return;
    try {
      await current.release();
    } catch {
      // Wake Lock is best-effort.
    }
  }

  function japaneseVoices() {
    const ja = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("ja"));
    return ja.length ? ja : voices;
  }

  function populateVoices() {
    voices = synth?.getVoices?.() || [];
    const available = japaneseVoices();
    const savedVoice = localStorage.getItem(VOICE_KEY);
    const currentVoice = voiceSelect.value || savedVoice || "";
    voiceSelect.replaceChildren();

    if (!available.length) {
      const option = document.createElement("option");
      option.textContent = "端末の標準音声";
      option.value = "";
      voiceSelect.append(option);
      return;
    }

    available.forEach((voice, index) => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = voice.name + " · " + voice.lang;
      if (voice.voiceURI === currentVoice || (!available.some((item) => item.voiceURI === currentVoice) && index === 0)) {
        option.selected = true;
      }
      voiceSelect.append(option);
    });
  }

  function selectedVoice() {
    return voices.find((voice) => voice.voiceURI === voiceSelect.value) || japaneseVoices()[0] || null;
  }

  function pronunciationText(text) {
    const replacements = [
      [/\bHTTPS\b/g, "エイチティーティーピーエス"],
      [/\bHTTP\b/g, "エイチティーティーピー"],
      [/\bAPI\b/g, "エーピーアイ"],
      [/\bSQL\b/g, "エスキューエル"],
      [/\bJSON\b/g, "ジェイソン"],
      [/\bRAG\b/g, "ラグ"],
      [/\bIAM\b/g, "アイアム"],
      [/\bRTO\b/g, "アールティーオー"],
      [/\bRPO\b/g, "アールピーオー"],
      [/\bWBS\b/g, "ダブリュービーエス"],
      [/\bKPI\b/g, "ケーピーアイ"],
      [/\bROI\b/g, "アールオーアイ"],
      [/\bOS\b/g, "オーエス"],
      [/\bIT\b/g, "アイティー"],
      [/\bAI\b/g, "エーアイ"],
      [/\bCI\/CD\b/g, "シーアイ・シーディー"],
      [/\bAs-Is\b/g, "アズイズ"],
      [/\bTo-Be\b/g, "トゥービー"],
      [/\bGitHub\b/gi, "ギットハブ"],
      [/\bGit\b/gi, "ギット"],
    ];
    return replacements.reduce((value, pair) => value.replace(pair[0], pair[1]), text);
  }

  function clearHighlight() {
    items.forEach((element) => element.classList.remove("speech-active"));
  }

  function setActive(nextIndex) {
    clearHighlight();
    const element = items[nextIndex];
    if (!element) return;
    element.classList.add("speech-active");
    element.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function updateControls() {
    const playing = state === "playing";
    const paused = state === "paused";
    playButton.textContent = paused ? "▶" : playing ? "↻" : "▶";
    playButton.setAttribute("aria-label", paused ? "読み上げを再開" : playing ? "現在の章を先頭から読み直す" : "読み上げを開始");
    pauseButton.disabled = !playing;
    stopButton.disabled = state === "idle";
    prevButton.disabled = chapterIndex <= 0;
    nextButton.disabled = chapterIndex >= sequence.length - 1;
    reader.dataset.state = state;
  }

  function showPlayer() {
    if (libraryOverlay) libraryOverlay.hidden = true;
    document.body.classList.remove("is-library-open");
    overlay.hidden = false;
    document.body.classList.add("is-learn-course-open");
  }

  function showLibrary() {
    overlay.hidden = true;
    document.body.classList.remove("is-learn-course-open");
    if (libraryOverlay) {
      libraryOverlay.hidden = false;
      document.body.classList.add("is-library-open");
    }
  }

  function failPlayback(message) {
    state = "idle";
    clearHighlight();
    status.textContent = message;
    void releaseWakeLock();
    updateControls();
  }

  function parseArticle(html) {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const source = parsed.querySelector("#learn-article");
    if (!source) throw new Error("Learn本文が見つかりません");
    const citations = parsed.querySelector("section.sources");
    return { body: source.innerHTML, citations: citations?.innerHTML ?? "" };
  }

  async function loadChapter(nextIndex, activeRun) {
    const lessonId = sequence[nextIndex];
    const meta = lessonMap?.get(lessonId);
    if (!meta?.learn_path) throw new Error("Learn教材が見つかりません: " + lessonId);

    status.textContent = "章を読み込み中";
    const response = await fetch(meta.learn_path);
    if (!response.ok) throw new Error("Learn教材の取得に失敗しました: " + response.status);
    const html = await response.text();
    if (activeRun !== runId) return false;

    const parsed = parseArticle(html);
    article.innerHTML = parsed.body;
    sources.innerHTML = parsed.citations;
    sources.hidden = !parsed.citations.trim();
    items = [...article.querySelectorAll("h1, h2, h3, p")]
      .filter((element) => element.textContent.trim().length > 0);
    if (!items.length) throw new Error("読み上げ本文がありません");

    chapterIndex = nextIndex;
    itemIndex = 0;
    completed = false;
    position.textContent = String(chapterIndex + 1).padStart(2, "0") + " / " + String(sequence.length).padStart(2, "0");
    status.textContent = (meta.title || lessonId) + " · 読み上げ準備完了";
    updateControls();
    article.querySelector("h1")?.scrollIntoView({ block: "start", behavior: "smooth" });
    return true;
  }

  async function finishChapter(activeRun) {
    if (activeRun !== runId || state !== "playing") return;
    if (chapterIndex >= sequence.length - 1) {
      state = "idle";
      completed = true;
      itemIndex = 0;
      clearHighlight();
      status.textContent = "コース再生が完了しました";
      await releaseWakeLock();
      updateControls();
      return;
    }

    try {
      const loaded = await loadChapter(chapterIndex + 1, activeRun);
      if (!loaded || activeRun !== runId || state !== "playing") return;
      speakCurrent(activeRun);
    } catch (error) {
      failPlayback(error instanceof Error ? error.message : "次の章を読み込めませんでした");
    }
  }

  function speakCurrent(activeRun) {
    if (activeRun !== runId || state !== "playing") return;
    if (itemIndex >= items.length) {
      void finishChapter(activeRun);
      return;
    }

    const element = items[itemIndex];
    const utterance = new SpeechSynthesisUtterance(pronunciationText(element.textContent.trim()));
    const voice = selectedVoice();
    utterance.lang = voice?.lang || "ja-JP";
    utterance.voice = voice;
    utterance.rate = Number(rateInput.value);

    utterance.onstart = () => {
      if (activeRun !== runId) return;
      setActive(itemIndex);
      status.textContent = String(chapterIndex + 1) + "章 · " + String(itemIndex + 1) + " / " + String(items.length) + " を読み上げ中";
      updateControls();
    };

    utterance.onend = () => {
      if (activeRun !== runId || state !== "playing") return;
      itemIndex += 1;
      speakCurrent(activeRun);
    };

    utterance.onerror = (event) => {
      if (activeRun !== runId) return;
      if (event.error === "canceled" || event.error === "interrupted") return;
      failPlayback("読み上げを開始できませんでした");
    };

    synth.speak(utterance);
  }

  function startFromCurrent() {
    if (!items.length) return;
    runId += 1;
    const activeRun = runId;
    synth.cancel();
    state = "playing";
    voiceChangedWhilePaused = false;
    void requestWakeLock();
    status.textContent = "読み上げを開始します";
    updateControls();
    speakCurrent(activeRun);
  }

  function resetCurrentChapter() {
    runId += 1;
    synth.cancel();
    state = "idle";
    itemIndex = 0;
    voiceChangedWhilePaused = false;
    clearHighlight();
    status.textContent = "停止しました";
    void releaseWakeLock();
    updateControls();
  }

  async function startCourse(courseId) {
    showPlayer();
    if (!synth || !("SpeechSynthesisUtterance" in window)) {
      failPlayback("このブラウザはページ内読み上げに対応していません");
      return;
    }

    runId += 1;
    const activeRun = runId;
    synth.cancel();
    state = "playing";
    completed = false;
    clearHighlight();
    status.textContent = "コースを読み込み中";
    updateControls();
    void requestWakeLock();

    try {
      await loadCatalogs();
      if (activeRun !== runId) return;
      course = courses.find((item) => item.id === courseId);
      if (!course) throw new Error("コースが見つかりません");
      sequence = course.chapters.filter((lessonId) => lessonMap.get(lessonId)?.learn_path);
      if (!sequence.length) throw new Error("このコースにはLearn教材がありません");
      courseTitle.textContent = course.title;
      const loaded = await loadChapter(0, activeRun);
      if (!loaded || activeRun !== runId || state !== "playing") return;
      speakCurrent(activeRun);
    } catch (error) {
      failPlayback(error instanceof Error ? error.message : "コースを開始できませんでした");
    }
  }

  async function moveChapter(delta) {
    const nextIndex = chapterIndex + delta;
    if (nextIndex < 0 || nextIndex >= sequence.length || !course) return;
    const autoplay = state === "playing";
    runId += 1;
    const activeRun = runId;
    synth.cancel();
    state = autoplay ? "playing" : "idle";
    clearHighlight();
    try {
      const loaded = await loadChapter(nextIndex, activeRun);
      if (!loaded || activeRun !== runId) return;
      if (autoplay) {
        void requestWakeLock();
        speakCurrent(activeRun);
      } else {
        void releaseWakeLock();
        updateControls();
      }
    } catch (error) {
      failPlayback(error instanceof Error ? error.message : "章を移動できませんでした");
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".learn-course-play");
    if (!button) return;
    const courseId = button.dataset.courseId;
    if (!courseId) return;
    void startCourse(courseId);
  });

  playButton.addEventListener("click", () => {
    if (!synth || !course || !items.length) return;
    if (state === "paused") {
      if (voiceChangedWhilePaused) {
        voiceChangedWhilePaused = false;
        startFromCurrent();
        return;
      }
      state = "playing";
      void requestWakeLock();
      synth.resume();
      status.textContent = String(chapterIndex + 1) + "章 · " + String(itemIndex + 1) + " / " + String(items.length) + " を読み上げ中";
      updateControls();
      return;
    }
    if (state === "playing") {
      itemIndex = 0;
      startFromCurrent();
      return;
    }
    if (completed) {
      void startCourse(course.id);
      return;
    }
    startFromCurrent();
  });

  pauseButton.addEventListener("click", () => {
    if (!synth || state !== "playing") return;
    synth.pause();
    state = "paused";
    status.textContent = "一時停止中";
    updateControls();
  });

  stopButton.addEventListener("click", resetCurrentChapter);
  prevButton.addEventListener("click", () => { void moveChapter(-1); });
  nextButton.addEventListener("click", () => { void moveChapter(1); });

  backButton.addEventListener("click", () => {
    resetCurrentChapter();
    showLibrary();
  });

  rateInput.addEventListener("input", () => {
    rateLabel.textContent = Number(rateInput.value).toFixed(1) + "×";
    localStorage.setItem(RATE_KEY, rateInput.value);
  });

  voiceSelect.addEventListener("change", () => {
    localStorage.setItem(VOICE_KEY, voiceSelect.value);
    if (state === "playing") {
      startFromCurrent();
    } else if (state === "paused") {
      voiceChangedWhilePaused = true;
      status.textContent = "音声を変更しました。再開時に現在位置から読み直します";
    }
  });

  if (!synth || !("SpeechSynthesisUtterance" in window)) {
    playButton.disabled = true;
    pauseButton.disabled = true;
    stopButton.disabled = true;
    voiceSelect.disabled = true;
    rateInput.disabled = true;
  } else {
    populateVoices();
    synth.addEventListener?.("voiceschanged", populateVoices);
    setTimeout(populateVoices, 250);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && (state === "playing" || state === "paused")) {
      void requestWakeLock();
    }
  });

  window.addEventListener("pagehide", () => {
    runId += 1;
    synth?.cancel();
    void releaseWakeLock();
  });

  window.addEventListener("beforeunload", () => {
    runId += 1;
    synth?.cancel();
    void releaseWakeLock();
  });

  updateControls();
})();