import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readHomepage = () =>
  readFile(new URL("../out/index.html", import.meta.url), "utf8");

test("homepage renders the approved Hero progression as one statement", async () => {
  const html = await readHomepage();

  for (const text of [
    "My work focuses on",
    "reconstructing research processes from interaction traces.",
    "preserving decision-relevant task state across sessions.",
    "evaluating when recorded trajectories can guide future decisions.",
  ]) {
    assert.ok(html.includes(text), `expected rendered copy: ${text}`);
  }

  const heroStatement = html.match(
    /<p class="hero-research-statement"[\s\S]*?<\/p>/,
  )?.[0];

  assert.ok(heroStatement, "expected one rendered Hero research statement");
  assert.match(heroStatement, /My work focuses on/);
  assert.match(heroStatement, /data-phrases/);
  assert.doesNotMatch(html, /class="hero-thesis"/);
});

test("homepage renders a concise Research sentence with three anchors", async () => {
  const html = await readHomepage();

  for (const text of [
    "My research connects three problems:",
    "process reconstruction from interaction traces",
    "task-state abstraction for multi-session continuation",
    "whether recorded trajectories can become reusable experience",
  ]) {
    assert.ok(html.includes(text), `expected rendered copy: ${text}`);
  }

  assert.doesNotMatch(
    html,
    /My research asks how long-horizon agent histories can be transformed/,
  );
});

test("homepage omits retired public framing", async () => {
  const html = await readHomepage();
  assert.doesNotMatch(html, /Previous work in retrieval and agent systems/);
  assert.doesNotMatch(html, /data-hero-theme/);
  assert.doesNotMatch(
    html,
    /I study how long-horizon interaction traces can be transformed/,
  );
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
