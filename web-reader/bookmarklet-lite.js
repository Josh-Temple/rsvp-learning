(() => {
  const ID = "rsvp-lite";
  const old = document.getElementById(ID);
  if (old) {
    old.remove();
    return;
  }

  const selected = window.getSelection?.().toString().trim() || "";
  let text = selected.length >= 20 ? selected : "";

  if (!text) {
    const source =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.querySelector("[role='main']") ||
      document.body;
    const copy = source.cloneNode(true);
    copy.querySelectorAll("nav,header,footer,aside,form,dialog,script,style,noscript,[aria-hidden='true']")
      .forEach((node) => node.remove());
    text = (copy.innerText || copy.textContent || "").replace(/\s+/g, " ").trim();
  }

  if (!text) {
    alert("本文を取得できませんでした");
    return;
  }

  function chunksOf(value) {
    const parts = value.match(/[^。！？!?]+[。！？!?]?/g) || [value];
    const out = [];
    const segmenter = Intl.Segmenter
      ? new Intl.Segmenter("ja", { granularity: "word" })
      : null;

    for (const part of parts) {
      const words = segmenter
        ? [...segmenter.segment(part)].map((item) => item.segment)
        : [...part];
      let current = "";

      for (const word of words) {
        if (current && (current + word).length > 14) {
          out.push(current.trim());
          current = word;
        } else {
          current += word;
        }

        if (current.length >= 8 && /[、，,；;：:]$/.test(current)) {
          out.push(current.trim());
          current = "";
        }
      }
      if (current.trim()) out.push(current.trim());
    }

    return out.filter(Boolean);
  }

  const chunks = chunksOf(text);
  if (!chunks.length) return;

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText =
    "position:fixed;left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));z-index:2147483647;margin:auto;max-width:720px;background:#f2efe8;color:#121722;border:1px solid #cbc8bf;border-radius:18px;box-shadow:0 12px 36px #0005;font-family:system-ui,-apple-system,sans-serif;overflow:hidden";

  const top = document.createElement("div");
  top.style.cssText =
    "display:flex;align-items:center;justify-content:space-between;padding:5px 8px 4px 12px;border-bottom:1px solid #ddd8cf;font-size:11px;color:#73766f";
  const label = document.createElement("span");
  label.textContent = selected.length >= 20 ? "選択範囲" : document.title;
  label.style.cssText = "overflow:hidden;white-space:nowrap;text-overflow:ellipsis";
  const close = document.createElement("button");
  close.textContent = "×";
  close.style.cssText =
    "width:32px;height:32px;border:0;background:transparent;color:inherit;font:20px system-ui";
  top.append(label, close);

  const stage = document.createElement("button");
  stage.type = "button";
  stage.style.cssText =
    "display:block;width:100%;min-height:96px;padding:12px 16px;border:0;background:transparent;color:#121722;font:680 clamp(28px,8.5vw,48px)/1.1 system-ui;text-align:center";

  const progress = document.createElement("div");
  progress.style.cssText = "height:3px;background:#e5e1d8";
  const fill = document.createElement("i");
  fill.style.cssText = "display:block;height:100%;background:#a85248";
  progress.append(fill);

  const dock = document.createElement("div");
  dock.style.cssText =
    "display:grid;grid-template-columns:42px 46px 42px 1fr auto;gap:5px;align-items:center;padding:7px 9px";

  const back = document.createElement("button");
  const play = document.createElement("button");
  const next = document.createElement("button");
  for (const button of [back, play, next]) {
    button.style.cssText =
      "height:38px;border:1px solid #cbc8bf;border-radius:10px;background:transparent;color:#121722;font:650 15px system-ui";
  }
  back.textContent = "←";
  play.textContent = "▶";
  play.style.background = "#121722";
  play.style.color = "#f2efe8";
  next.textContent = "→";

  const speed = document.createElement("input");
  speed.type = "range";
  speed.min = "0.6";
  speed.max = "10";
  speed.step = "0.1";
  speed.value = "1";
  speed.style.cssText = "width:100%;accent-color:#5d7487";

  const meta = document.createElement("span");
  meta.style.cssText =
    "min-width:72px;color:#73766f;font:11px system-ui;text-align:right;font-variant-numeric:tabular-nums";

  dock.append(back, play, next, speed, meta);
  host.append(top, stage, progress, dock);
  document.documentElement.append(host);

  let index = 0;
  let playing = false;
  let timer = 0;
  let rate = 1;

  function render() {
    stage.textContent = chunks[index];
    fill.style.width = ((index + 1) / chunks.length) * 100 + "%";
    meta.textContent = (index + 1) + "/" + chunks.length + " · " + rate.toFixed(1) + "×";
    play.textContent = playing ? "Ⅱ" : "▶";
  }

  function stop() {
    playing = false;
    clearTimeout(timer);
    render();
  }

  function schedule() {
    if (!playing) return;
    const value = chunks[index];
    const pause = /[。！？!?]$/.test(value) ? 1.25 : /[、，,]$/.test(value) ? 1.08 : 1;
    timer = setTimeout(() => {
      if (index >= chunks.length - 1) {
        stop();
        return;
      }
      index += 1;
      render();
      schedule();
    }, Math.max(50, Math.round(650 * pause / rate)));
  }

  function toggle() {
    if (playing) {
      stop();
      return;
    }
    if (index >= chunks.length - 1) index = 0;
    playing = true;
    render();
    schedule();
  }

  function move(delta) {
    stop();
    index = Math.max(0, Math.min(chunks.length - 1, index + delta));
    render();
  }

  close.onclick = () => {
    stop();
    host.remove();
  };
  stage.onclick = toggle;
  play.onclick = toggle;
  back.onclick = () => move(-1);
  next.onclick = () => move(1);
  speed.oninput = () => {
    rate = Number(speed.value);
    if (playing) {
      clearTimeout(timer);
      render();
      schedule();
    } else {
      render();
    }
  };

  render();
})();
