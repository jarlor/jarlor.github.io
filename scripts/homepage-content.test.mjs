import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readHomepage = () =>
  readFile(new URL("../out/index.html", import.meta.url), "utf8");

test("homepage uses the supplied studio portrait", async () => {
  const html = await readHomepage();

  assert.match(html, /jiale-zhang-photo\.jpg/);
});

test("portrait asset preserves the uploaded JPEG byte for byte", async () => {
  const portrait = await readFile(
    new URL("../public/jiale-zhang-photo.jpg", import.meta.url),
  );
  const digest = createHash("sha256").update(portrait).digest("hex");

  assert.equal(
    digest,
    "8a73776a35d39bfdb0d4ae7a6185fac2f3795b6af4ef3075581c199c8cc3c1db",
  );
});

test("homepage renders the approved Hero progression as one statement", async () => {
  const html = await readHomepage();

  for (const text of [
    "I study how agents",
    "reconstruct task state from execution history.",
    "decide when to continue, narrow, or revisit.",
    "make sustained progress on long-horizon tasks.",
  ]) {
    assert.ok(html.includes(text), `expected rendered copy: ${text}`);
  }

  const heroStatement = html.match(
    /<p class="hero-research-statement"[\s\S]*?<\/p>/,
  )?.[0];

  assert.ok(heroStatement, "expected one rendered Hero research statement");
  assert.match(heroStatement, /I study how agents/);
  assert.match(heroStatement, /data-phrases/);
  assert.doesNotMatch(html, /class="hero-thesis"/);
});

test("Research connects representation to control without claiming results", async () => {
  const html = await readHomepage();

  for (const text of [
    "My current research connects",
    "process representation",
    "inference-time control",
    "continue, narrow, or revisit",
    "evaluate whether these interventions lead to sustained progress",
    "Scientific research is my primary setting",
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
  assert.doesNotMatch(html, /Re-Searching|Lucid|recursive self-improvement/);
  assert.doesNotMatch(html, /[—–]/);
});

test("Research is readable static content, not an interactive diagram", async () => {
  const html = await readHomepage();
  const researchSection = html.match(
    /<section class="research"[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(researchSection, "expected the rendered Research section");
  assert.doesNotMatch(researchSection, /<button|role="button"|<svg|<canvas|data-focus/);
  assert.match(researchSection, /<strong>process representation<\/strong>/);
  assert.match(researchSection, /<strong>inference-time control<\/strong>/);
});

test("profile retains education, contact details and slogan, with no CV", async () => {
  const html = await readHomepage();
  for (const text of [
    "Ph.D. Student", "Fudan University", "2026-present", "2023-2026",
    "University of Chinese Academy of Sciences", "Ethically aligned.",
    "Probably.", "jlzhang26@m.fudan.edu.cn", "jarlor@foxmail.com",
  ]) {
    assert.ok(html.includes(text), `expected profile copy: ${text}`);
  }
  assert.doesNotMatch(html, /Incoming Ph.D.|Ph.D. Candidate|academic-cv.pdf/);
});

test("publications retain original previews, author highlights and resources", async () => {
  const html = await readHomepage();
  const section = html.match(/<section class="publications"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.equal((section.match(/class="publication-entry"/g) ?? []).length, 3);
  assert.equal((section.match(/class="self-author"/g) ?? []).length, 3);
  for (const path of [
    "/paper-figures/slimrag/comparison.png",
    "/paper-figures/chunkgraph/workflow.png",
    "/paper-figures/ai2agent/paradigms.png",
    "https://arxiv.org/abs/2506.17288",
    "https://arxiv.org/pdf/2506.17288",
    "https://github.com/continue-ai-company/SlimRAG",
    "https://doi.org/10.1109/ICCC68654.2025.11438132",
    "https://aclanthology.org/2025.acl-demo.51/",
  ]) {
    assert.ok(section.includes(path), `expected publication resource: ${path}`);
  }
});
