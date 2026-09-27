from html.parser import HTMLParser
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path.cwd()
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.tags = set()
        self.ids = []
        self.metas = {}
        self.title = ""
        self.in_title = False
        self.lang = None
        self.article_depth = 0
        self.article_text = []
        self.article_in_main = False
        self.scripts = []
        self.styles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.add(tag)
        if tag == "html":
            self.lang = attrs.get("lang")
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "meta":
            self.metas[attrs.get("name", "").lower()] = attrs.get("content", "")
        if tag == "title":
            self.in_title = True
        if tag == "main":
            self.main_depth = getattr(self, "main_depth", 0) + 1
        if tag == "article":
            self.article_depth += 1
            self.article_in_main = getattr(self, "main_depth", 0) > 0
        if tag == "script" and attrs.get("src"):
            self.scripts.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.styles.append(attrs.get("href", ""))
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "article":
            self.article_depth -= 1
        if tag == "main":
            self.main_depth -= 1
        if tag not in VOID:
            if not self.stack or self.stack[-1] != tag:
                self.errors.append(f"unbalanced closing tag </{tag}>")
            else:
                self.stack.pop()

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.article_depth and data.strip():
            self.article_text.append(data)

def fail(message):
    print(f"Learn HTML validation: FAIL - {message}", file=sys.stderr)
    raise SystemExit(1)

catalog = json.loads((ROOT / "lessons/index.json").read_text(encoding="utf-8"))
learn_entries = [entry for entry in catalog["lessons"] if entry.get("learn_path")]
html_files = sorted((ROOT / "learn").glob("*.html"))
if len(html_files) != len(learn_entries):
    fail(f"catalog has {len(learn_entries)} Learn paths but learn/ has {len(html_files)} HTML files")

for file in html_files:
    parser = PageParser()
    source = file.read_text(encoding="utf-8")
    parser.feed(source)
    parser.close()
    rel = "./learn/" + file.name
    if not any(item.get("learn_path") == rel for item in learn_entries):
        fail(f"{file} is not registered in lessons/index.json")
    if parser.errors or parser.stack:
        fail(f"{file}: " + "; ".join(parser.errors + ([f"unclosed tags {parser.stack}"] if parser.stack else [])))
    if parser.lang != "ja":
        fail(f"{file}: html lang is not ja")
    if not parser.title.strip() or not {"html", "main", "article", "h1", "h2", "p"}.issubset(parser.tags):
        fail(f"{file}: missing document/title/main/article/heading/text structure")
    if not parser.article_in_main or not parser.article_text:
        fail(f"{file}: article has no static text inside main")
    if parser.metas.get("viewport") is None or not parser.metas.get("description"):
        fail(f"{file}: viewport or description missing")
    if len(parser.ids) != len(set(parser.ids)):
        fail(f"{file}: duplicate id")
    required_ids = {"speech-play", "speech-pause", "speech-stop", "speech-voice", "speech-rate", "speech-status"}
    if not required_ids.issubset(set(parser.ids)):
        fail(f"{file}: missing read-aloud controls")
    if "./learn.js" not in parser.scripts or "./learn.css" not in parser.styles:
        fail(f"{file}: missing shared player assets")
    if "<script>" in source or "<style>" in source:
        fail(f"{file}: inline script/style remains")

player = ROOT / "learn/learn.js"
result = subprocess.run(["node", "--check", str(player)], cwd=ROOT, capture_output=True, text=True)
if result.returncode:
    fail(f"learn.js syntax error: {result.stderr.strip()}")
print(f"Learn HTML validation: PASS ({len(html_files)} pages; static DOM and balanced tags)")
