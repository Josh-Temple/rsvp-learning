(() => {
  const old = document.getElementById("rsvp-probe");
  if (old) {
    old.remove();
    return;
  }
  const bar = document.createElement("div");
  bar.id = "rsvp-probe";
  bar.textContent = "RSVP TEST OK";
  bar.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;padding:16px;border-radius:12px;background:#121722;color:#fff;font:700 18px system-ui;text-align:center;box-shadow:0 8px 30px #0006";
  document.documentElement.append(bar);
  setTimeout(() => bar.remove(), 5000);
})();
