(() => {
      const top = document.querySelector(".top");
      if (top?.querySelector && top?.prepend) {
        const oldBack = top.querySelector("a");
        oldBack?.remove();

        const nav = document.createElement("nav");
        nav.className = "mode-nav";
        nav.setAttribute("aria-label", "モード切替");

        const links = [
          ["RSVP", "../index.html", "RSVPへ移動"],
          ["LEARN", "../index.html?library=learn", "Learn教材一覧へ移動"],
          ["LISTEN", "../index.html?library=listen", "Listenへ移動"],
        ];

        for (const [label, href, aria] of links) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = label;
          link.setAttribute("aria-label", aria);
          if (label === "LEARN") {
            link.className = "is-active";
            link.setAttribute("aria-current", "page");
          }
          nav.append(link);
        }

        top.prepend(nav);
      }

      const synth = window.speechSynthesis;
      const article = document.querySelector("#learn-article");
      const playButton = document.querySelector("#speech-play");
      const pauseButton = document.querySelector("#speech-pause");
      const stopButton = document.querySelector("#speech-stop");
      const voiceSelect = document.querySelector("#speech-voice");
      const rateInput = document.querySelector("#speech-rate");
      const rateLabel = document.querySelector("#speech-rate-label");
      const status = document.querySelector("#speech-status");
      const reader = document.querySelector("#speech-reader");

      const items = [...article.querySelectorAll("h1, h2, h3, p")]
        .filter((element) => element.textContent.trim().length > 0);

      let voices = [];
      let index = 0;
      let state = "idle";
      let runId = 0;
      let voiceChangedWhilePaused = false;
      let wakeLock = null;
      let wakeLockWanted = false;

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
          // Wake Lock is best-effort; speech controls must continue to work.
        }
      }

      function japaneseVoices() {
        const ja = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("ja"));
        return ja.length ? ja : voices;
      }

      function populateVoices() {
        voices = synth?.getVoices?.() ?? [];
        const available = japaneseVoices();
        const selectedVoiceUri = voiceSelect.value;
        voiceSelect.replaceChildren();

        if (!available.length) {
          const option = document.createElement("option");
          option.textContent = "端末の標準音声";
          option.value = "";
          voiceSelect.append(option);
          return;
        }

        available.forEach((voice, i) => {
          const option = document.createElement("option");
          option.value = voice.voiceURI;
          option.textContent = `${voice.name} · ${voice.lang}`;
          if (voice.voiceURI === selectedVoiceUri || (!available.some((item) => item.voiceURI === selectedVoiceUri) && i === 0)) {
            option.selected = true;
          }
          voiceSelect.append(option);
        });
      }

      function selectedVoice() {
        return voices.find((voice) => voice.voiceURI === voiceSelect.value) ?? japaneseVoices()[0] ?? null;
      }

      function clearHighlight() {
        items.forEach((element) => element.classList.remove("speech-active"));
      }

      function setActive(nextIndex) {
        clearHighlight();
        if (!items[nextIndex]) return;
        items[nextIndex].classList.add("speech-active");
        items[nextIndex].scrollIntoView({ block: "center", behavior: "smooth" });
      }

      function updateControls() {
        const playing = state === "playing";
        const paused = state === "paused";
        playButton.textContent = paused ? "▶" : playing ? "↻" : "▶";
        playButton.setAttribute("aria-label", paused ? "読み上げを再開" : playing ? "先頭から読み直す" : "読み上げを開始");
        pauseButton.disabled = !playing;
        stopButton.disabled = state === "idle";
        if (reader) reader.dataset.state = state;
      }

      function resetToStart() {
        runId += 1;
        synth.cancel();
        void releaseWakeLock();
        state = "idle";
        index = 0;
        voiceChangedWhilePaused = false;
        clearHighlight();
        delete status.dataset.speechError;
        status.textContent = "停止しました";
        updateControls();
      }

      function pronunciationText(text) {
        const replacements = [
          [/\bHTTPS\b/g, "エイチティーティーピーエス"],
          [/\bHTTP\b/g, "エイチティーティーピー"],
          [/\bSQL\b/g, "エスキューエル"],
          [/\bSELECT\b/g, "セレクト"],
          [/\bFROM\b/g, "フロム"],
          [/\bWHERE\b/g, "ウェア"],
          [/\bAND\b/g, "アンド"],
          [/\bOR\b/g, "オア"],
          [/\bORDER\b/g, "オーダー"],
          [/\bBY\b/g, "バイ"],
          [/\bASC\b/g, "エーエスシー"],
          [/\bDESC\b/g, "デスク"],
          [/\bDISTINCT\b/g, "ディスティンクト"],
          [/\bLIMIT\b/g, "リミット"],
          [/\bJOIN\b/g, "ジョイン"],
          [/\bINNER\b/g, "インナー"],
          [/\bLEFT\b/g, "レフト"],
          [/\bGROUP\b/g, "グループ"],
          [/\bHAVING\b/g, "ハビング"],
          [/\bCOUNT\b/g, "カウント"],
          [/\bSUM\b/g, "サム"],
          [/\bAVG\b/g, "エーブイジー"],
          [/\bNULL\b/g, "ナル"],
          [/\bGET\b/g, "ゲット"],
          [/\bPOST\b/g, "ポスト"],
          [/\bPUT\b/g, "プット"],
          [/\bPATCH\b/g, "パッチ"],
          [/\bDELETE\b/g, "デリート"],
          [/\bREST\b/g, "レスト"],
          [/\bIAM\b/g, "アイアム"],
          [/\bID\b/g, "アイディー"],
          [/\bOS\b/g, "オーエス"],
          [/\bIT\b/g, "アイティー"],
          [/\bAI\b/g, "エーアイ"],
          [/\bA\/B\b/g, "エービー"],
        ];
        return replacements.reduce((value, [pattern, spoken]) => value.replace(pattern, spoken), text);
      }

      // Keep speech diagnostics actionable without exposing arbitrary engine messages.
      // Only known Web Speech error codes may appear in the UI or test attributes.
      const knownSpeechErrors = new Set([
        "canceled", "interrupted", "audio-busy", "audio-hardware",
        "network", "synthesis-unavailable", "synthesis-failed",
        "language-unavailable", "voice-unavailable", "text-too-long",
        "invalid-argument", "not-allowed"
      ]);

      function safeSpeechErrorCode(code) {
        return typeof code === "string" && knownSpeechErrors.has(code) ? code : "unknown";
      }

      function showSpeechError(code, hasStarted) {
        state = "idle";
        clearHighlight();
        const safeCode = safeSpeechErrorCode(code);
        status.dataset.speechError = safeCode;
        status.textContent = (hasStarted ? "読み上げ中にエラーが発生しました" : "読み上げを開始できませんでした")
          + `（音声エラー: ${safeCode}）`;
        void releaseWakeLock();
        updateControls();
      }

      function speakCurrent(activeRun) {
        if (activeRun !== runId || state !== "playing") return;

        if (index >= items.length) {
          state = "idle";
          index = 0;
          voiceChangedWhilePaused = false;
          clearHighlight();
          status.textContent = "読み上げが完了しました";
          void releaseWakeLock();
          updateControls();
          return;
        }

        const element = items[index];
        let utteranceStarted = false;
        const utterance = new SpeechSynthesisUtterance(pronunciationText(element.textContent.trim()));
        const voice = selectedVoice();

        utterance.lang = voice?.lang || "ja-JP";
        utterance.voice = voice;
        utterance.rate = Number(rateInput.value);

        utterance.onstart = () => {
          if (activeRun !== runId) return;
          utteranceStarted = true;
          setActive(index);
          status.textContent = `${index + 1} / ${items.length} を読み上げ中`;
          updateControls();
        };

        utterance.onend = () => {
          if (activeRun !== runId || state !== "playing") return;
          index += 1;
          speakCurrent(activeRun);
        };

        utterance.onerror = (event) => {
          if (activeRun !== runId) return;
          if (event.error === "canceled" || event.error === "interrupted") return;
          showSpeechError(event.error, utteranceStarted);
        };

        try {
          synth.speak(utterance);
        } catch (error) {
          if (activeRun !== runId) return;
          // Never put arbitrary exception messages into the document.
          const safeCode = error?.name === "NotAllowedError" ? "not-allowed" : "unknown";
          showSpeechError(safeCode, utteranceStarted);
        }
      }

      function startFromCurrent() {
        runId += 1;
        const activeRun = runId;
        delete status.dataset.speechError;
        synth.cancel();
        state = "playing";
        void requestWakeLock();
        status.textContent = "読み上げを開始します";
        updateControls();
        speakCurrent(activeRun);
      }

      playButton.addEventListener("click", () => {
        if (!synth) return;

        if (state === "paused") {
          if (voiceChangedWhilePaused) {
            voiceChangedWhilePaused = false;
            startFromCurrent();
            return;
          }
          state = "playing";
          void requestWakeLock();
          synth.resume();
          status.textContent = `${index + 1} / ${items.length} を読み上げ中`;
          updateControls();
          return;
        }

        if (state === "playing") {
          index = 0;
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

      stopButton.addEventListener("click", resetToStart);

      rateInput.addEventListener("input", () => {
        rateLabel.textContent = `${Number(rateInput.value).toFixed(1)}×`;
      });

      voiceSelect.addEventListener("change", () => {
        if (state === "playing") {
          startFromCurrent();
        } else if (state === "paused") {
          voiceChangedWhilePaused = true;
          status.textContent = "音声を変更しました。再開時に現在位置から読み直します";
        }
      });

      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        playButton.disabled = true;
        pauseButton.disabled = true;
        stopButton.disabled = true;
        voiceSelect.disabled = true;
        rateInput.disabled = true;
        status.textContent = "このブラウザはページ内読み上げに対応していません";
        return;
      }

      populateVoices();
      synth.addEventListener?.("voiceschanged", populateVoices);
      setTimeout(populateVoices, 250);
      status.textContent = "▶で本文を読み上げます";
      updateControls();

      document.addEventListener?.("visibilitychange", () => {
        if (document.visibilityState === "visible" && (state === "playing" || state === "paused")) {
          void requestWakeLock();
        }
      });

      window.addEventListener("pagehide", () => {
        synth.cancel();
        void releaseWakeLock();
      });
      window.addEventListener("beforeunload", () => {
        synth.cancel();
        void releaseWakeLock();
      });
    })();
