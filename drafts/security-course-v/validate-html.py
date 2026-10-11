"""Validate off-Catalog candidate HTML without changing production validators."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.ids = []
        self.article_count = 0
        self.article_text = []
        self.scripts = []
        self.styles = []
        self.base = []
        self.rate = None
        self.language = None
        self.metadata = {}

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.append(attributes["id"])
        if any(name.startswith("on") for name, _ in attrs):
            self.errors.append("inline event handler")
        if tag == "html":
            self.language = attributes.get("lang")
        if tag == "meta":
            self.metadata[attributes.get("name", "")] = attributes.get("content", "")
        if tag == "base":
            self.base.append(attributes.get("href"))
        if tag == "article":
            self.article_count += 1
            if "main" not in self.stack or attributes.get("id") != "learn-article":
                self.errors.append("speech article must be inside main with correct id")
        if "article" in self.stack and tag not in {"h1", "h2", "h3", "p"}:
            self.errors.append(f"unsupported speech tag {tag}")
        if "article" in self.stack and "sources" in attributes.get("class", "").split():
            self.errors.append("sources in speech article")
        if tag == "script":
            self.scripts.append(attributes.get("src"))
        if tag == "link" and attributes.get("rel") == "stylesheet":
            self.styles.append(attributes.get("href"))
        if attributes.get("id") == "speech-rate":
            self.rate = attributes
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag not in VOID:
            if not self.stack or self.stack[-1] != tag:
                self.errors.append(f"unbalanced closing {tag}")
            else:
                self.stack.pop()

    def handle_data(self, data):
        if "article" in self.stack and data.strip():
            self.article_text.append(data)


def validate_page(source, filename):
    page = Page()
    page.feed(source)
    page.close()
    errors = page.errors.copy()
    if page.stack:
        errors.append(f"unclosed {page.stack}")
    if page.language != "ja" or page.article_count != 1 or not page.article_text:
        errors.append("missing static Japanese speech article")
    if len(page.ids) != len(set(page.ids)):
        errors.append("duplicate id")
    controls = {"speech-reader", "speech-play", "speech-pause", "speech-stop", "speech-voice", "speech-rate", "speech-status"}
    if not controls.issubset(page.ids):
        errors.append("missing speech controls")
    if not page.metadata.get("description") or "viewport" not in page.metadata:
        errors.append("missing metadata")
    if page.base != ["../../../learn/"] or page.scripts != ["./learn.js"] or page.styles != ["./learn.css"]:
        errors.append("shared assets / base resolution changed")
    else:
        # Existing player creates ../index.html links, relative to document.baseURI.
        base = (filename.parent / page.base[0]).resolve()
        for target in (base / "learn.js", base / "learn.css", base / "../index.html"):
            if not target.resolve().is_file():
                errors.append(f"missing resolved asset/navigation {target}")
    if page.rate is None or page.rate.get("min") != "0.7" or page.rate.get("max") != "4.0":
        errors.append("speech speed controls changed")
    return errors


if __name__ == "__main__":
    if sys.argv[1:] == ["--stdin"]:
        inputs = [(ROOT / "learn/security-secure-by-design-default.html", sys.stdin.read())]
    else:
        filenames = [Path(value) for value in sys.argv[1:]] or sorted((ROOT / "learn").glob("*.html"))
        inputs = [(filename, filename.read_text(encoding="utf-8")) for filename in filenames]
    for filename, source in inputs:
        errors = validate_page(source, filename)
        if errors:
            raise SystemExit(f"{filename.name}: FAIL: {'; '.join(errors)}")
    print(f"Candidate HTML: PASS ({len(inputs)} pages; balanced static DOM and resolved shared assets)")
