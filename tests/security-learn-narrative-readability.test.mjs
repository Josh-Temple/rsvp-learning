import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

// This tests the regression to a 50+ paragraph recital. It does not substitute for content review.
const names = [
  "adversaries-initial-access",
  "assets-dependencies",
  "c2-exfiltration-stealth",
  "communication-path-boundaries",
  "container-serverless-saas-iot",
  "data-classification-encryption-retention",
  "defense-in-depth",
  "dns-tls-https",
  "endpoint-hardening-edr-mdm",
  "key-secret-credential-lifecycle",
  "post-compromise-movement",
  "purpose-principles",
  "rbac-abac-privileged-access",
  "risk-treatment",
  "segmentation-vpn-zero-trust",
  "signatures-pki-certificates",
  "symmetric-public-key-hash-mac",
  "threats-vulnerabilities"
];
test("18 security Learn chapters have short, contextual recaps and unchanged player controls", async () => {
  assert.equal(names.length, 18);
  for (const name of names) {
    const html = await fs.readFile(new URL("../learn/security-" + name + ".html", import.meta.url), "utf8");
    const article = html.match(/<article id="learn-article">([\s\S]*?)<\/article>/)?.[1];
    assert.ok(article, name + ": missing article");
    assert.ok(article.includes("<h2>短い振り返り</h2>"), name + ": missing narrative recap");
    assert.ok(!article.includes("<h2>要点の再確認</h2>"), name + ": old recap restored");
    const recap = article.match(/<h2>短い振り返り<\/h2>([\s\S]*?)<h3>この教材の扱う範囲<\/h3>/)?.[1];
    assert.ok(recap, name + ": missing scope note");
    const paragraphs = [...recap.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => m[1].trim());
    assert.ok(paragraphs.length >= 2 && paragraphs.length <= 3, name + ": fragmented recap");
    assert.ok(paragraphs.every(p => p.length >= 65), name + ": very short recap");
    for (const id of ["speech-reader", "speech-play", "speech-pause", "speech-stop", "speech-voice", "speech-rate", "speech-status"]) {
      assert.ok(html.includes('id="' + id + '"'), name + ": missing reader control " + id);
    }
    assert.match(html, /<section class="sources"[\s\S]*?<a href="https:\/\//, name + ": source links missing");
  }
});
