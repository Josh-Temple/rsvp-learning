/* Shared navigation for standalone Listen articles. */
(() => {
  const nav = document.querySelector(".topbar .mode-nav");
  if (!nav) return;
  const links = [...nav.querySelectorAll("a")];
  if (links.length !== 3) return;

  const labels = ["RSVP", "Learn", "Listen"];
  links.forEach((link, index) => {
    link.textContent = labels[index];
    link.classList.add("mode-tab");
    link.setAttribute("aria-label", index === 0 ? "RSVPへ移動" : index === 1 ? "Learn教材一覧へ移動" : "Listen一覧へ移動");
  });
  links[2].href = "../index.html";
  nav.setAttribute("aria-label", "学習モード");

  const back = document.createElement("a");
  back.href = "../index.html";
  back.className = "article-back";
  back.textContent = "← Listen一覧へ";
  back.setAttribute("aria-label", "Listen一覧へ戻る");
  nav.parentElement.prepend(back);
})();
