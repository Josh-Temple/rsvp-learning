const THEME_KEY = "rsvp:theme";

const list = document.querySelector("#listen-list");
const themeToggle = document.querySelector("#theme-toggle");

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme, persist = true) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  themeToggle.textContent = next === "dark" ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", next === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え");
  if (persist) localStorage.setItem(THEME_KEY, next);
}

function iconFor(category) {
  if (category === "news") {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>';
  }
  if (category === "research") {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9h14l-5-9V3"/><path d="M8 14h8"/></svg>';
  }
  if (category === "report") {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short" }).format(date);
}

function render(items) {
  list.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "まだありません";
    list.append(empty);
    return;
  }

  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.date)) groups.set(item.date, []);
    groups.get(item.date).push(item);
  }

  for (const [date, entries] of groups) {
    const section = document.createElement("section");
    section.className = "day";

    const heading = document.createElement("h2");
    heading.className = "day-label";
    heading.textContent = formatDate(date);
    section.append(heading);

    for (const item of entries) {
      const row = document.createElement("a");
      row.className = "listen-row";
      row.href = item.path;
      row.setAttribute("aria-label", item.title);

      const kind = document.createElement("span");
      kind.className = "kind";
      kind.innerHTML = iconFor(item.category);

      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = item.title;

      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "›";

      row.append(kind, title, arrow);
      section.append(row);
    }

    list.append(section);
  }
}

async function load() {
  try {
    const response = await fetch("./index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Listen一覧の取得に失敗しました: ${response.status}`);
    const catalog = await response.json();
    const items = [...(catalog.items ?? [])]
      .filter((item) => item && item.title && item.date && item.path)
      .sort((a, b) => b.date.localeCompare(a.date));
    render(items);
  } catch (error) {
    console.error(error);
    list.innerHTML = '<div class="empty">読み込みエラー</div>';
  }
}

themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

applyTheme(currentTheme(), false);
load();
