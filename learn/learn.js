(() => {
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

      function japaneseVoices() {
        const ja = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("ja"));
        return ja.length ? ja : voices;
      }

      function populateVoices() {
        voices = synth?.getVoices?.() ?? [];
        const available = japaneseVoices();
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
          if (i === 0) option.selected = true;
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
        state = "idle";
        index = 0;
        voiceChangedWhilePaused = false;
        clearHighlight();
        status.textContent = "停止しました";
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
          updateControls();
          return;
        }

        const element = items[index];
        const utterance = new SpeechSynthesisUtterance(element.textContent.trim());
        const voice = selectedVoice();

        utterance.lang = voice?.lang || "ja-JP";
        utterance.voice = voice;
        utterance.rate = Number(rateInput.value);

        utterance.onstart = () => {
          if (activeRun !== runId) return;
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
          state = "idle";
          clearHighlight();
          status.textContent = "読み上げを開始できませんでした";
          updateControls();
        };

        synth.speak(utterance);
      }

      function startFromCurrent() {
        runId += 1;
        const activeRun = runId;
        synth.cancel();
        state = "playing";
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

      window.addEventListener("beforeunload", () => synth.cancel());
    })();
