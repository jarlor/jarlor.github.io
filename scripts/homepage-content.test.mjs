import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readHomepage = () =>
  readFile(new URL("../out/index.html", import.meta.url), "utf8");

test("homepage uses the approved research progression", async () => {
  const html = await readHomepage();

  for (const text of [
    "decision-relevant representations for research agents",
    "from interaction traces",
    "to task-level state",
    "toward reusable experience",
    "verified experience",
  ]) {
    assert.match(html, new RegExp(text));
  }
});

test("homepage omits retired public framing", async () => {
  const html = await readHomepage();
  assert.doesNotMatch(html, /Previous work in retrieval and agent systems/);
  assert.doesNotMatch(html, /data-hero-theme/);
});

test("rendered homepage contains no product disclosure or long dash", async () => {
  const html = await readHomepage();
  assert.doesNotMatch(html, /Re-Searching/);
  assert.doesNotMatch(html, /[—–]/);
});

test("research themes remain inline flow content on narrow screens", async () => {
  const html = await readHomepage();
  const researchSection = html.match(
    /<section class="research"[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(researchSection, "expected the rendered Research section");
  assert.doesNotMatch(researchSection, /<button/);
  assert.match(researchSection, /role="button"/);
});
