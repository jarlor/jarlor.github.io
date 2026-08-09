# Research Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's parallel research-topic framing with a synchronized progression from interaction traces to task state, reusable experience, and prospective learning.

**Architecture:** Keep one typed research-stage model in `app/data/research.ts`. `PageMotion` owns automatic typewriter timing and dispatches stage events, `ResearchNarrative` owns the continuous interactive research statement, and `ResearchTrace` renders the synchronized background state. Static page copy remains server-rendered in `app/page.tsx` and `app/data/site.ts`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, GSAP 3, Tailwind CSS 4, native Canvas 2D, Node.js test runner.

## Global Constraints

- Preserve the current page order, routes, navigation, portrait, publication entries, publication modal, themes, and contact information.
- Do not add dependencies.
- Do not name Re-Searching in visible page copy.
- Do not claim that process graphs are causal graphs, MDP states, or completed reinforcement-learning results.
- Keep `Long-Horizon LLM Agents` on one line at normal desktop widths.
- Remove the Hero stage buttons and the redundant Publications introduction.
- Research interactions must not change font weight, line height, or letter spacing.
- Automatic motion must stop under `prefers-reduced-motion: reduce`.
- Visible page copy must contain no em dash or en dash characters.
- Run `npm test` as the repository verification command.

---

## File Structure

- Create `scripts/homepage-content.test.mjs`: rendered GitHub Pages HTML contract using Node's built-in test runner.
- Modify `package.json`: run the content contract before lint and production build.
- Modify `app/data/research.ts`: single typed definition of TRACE, STATE, and EXPERIENCE stages.
- Modify `app/data/site.ts`: updated metadata description.
- Modify `app/page.tsx`: static Hero statement, no Hero stage controls, no Publications introduction, updated Contact copy.
- Modify `app/components/PageMotion.tsx`: faster left-in typewriter, automatic stage dispatch, manual override and resume.
- Rename `app/components/ResearchFieldSelector.tsx` to `app/components/ResearchNarrative.tsx`: continuous research paragraph with three stable inline controls.
- Modify `app/components/ResearchTrace.tsx`: map the renamed stages to trace, state, and experience canvas formations.
- Modify `app/globals.css`: Hero statement and typewriter layout, Research narrative emphasis, synchronized background transitions, mobile and reduced-motion rules.

---

### Task 1: Public Copy Contract and Research Stage Model

**Files:**
- Create: `scripts/homepage-content.test.mjs`
- Modify: `package.json`
- Modify: `app/data/research.ts`
- Modify: `app/data/site.ts`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `ResearchStageId = "TRACE" | "STATE" | "EXPERIENCE"`.
- Produces: `researchStages`, `researchStagesById`, `researchStageIds`, `defaultResearchStageId`, `RESEARCH_STAGE_EVENT`, and `ResearchStageEventDetail`.
- Consumes: no new runtime dependencies.

- [ ] **Step 1: Add a failing public-copy contract**

Create `scripts/homepage-content.test.mjs` with Node test cases that read the exported `out/index.html` and assert the visitor-visible result:

```js
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
```

- [ ] **Step 2: Run the contract and confirm failure**

Run:

```bash
node --test scripts/homepage-content.test.mjs
```

Expected: FAIL because the approved research statement and stage phrases are absent and the Publications introduction still exists.

- [ ] **Step 3: Replace the typed stage model**

Change `app/data/research.ts` so each stage contains:

```ts
type ResearchStage = {
  id: ResearchStageId;
  heroPhrase: string;
  inlineLabel: string;
};
```

Use these exact values:

```ts
[
  {
    id: "TRACE",
    heroPhrase: "from interaction traces",
    inlineLabel: "process reconstruction from interaction traces",
  },
  {
    id: "STATE",
    heroPhrase: "to task-level state",
    inlineLabel: "task-state abstraction for multi-session continuation",
  },
  {
    id: "EXPERIENCE",
    heroPhrase: "toward reusable experience",
    inlineLabel: "verified experience",
  },
]
```

Rename the event to `research-stage-change` and use sources `hero-cycle` and `manual`.

- [ ] **Step 4: Update server-rendered copy**

In `app/page.tsx`:

- render the approved static Hero statement before the typewriter window;
- render only the typewriter phrase in `data-phrases`;
- remove `.hero-research-sequence` and every `data-hero-theme` control;
- remove the Publications paragraph;
- change Contact copy to `I welcome discussions on long-horizon agents, task-state representation, and learning from recorded interactions.`;
- replace the `ResearchFieldSelector` import with `ResearchNarrative` after Task 2 renames the file.

Update `siteProfile.description` to describe decision-relevant process representation, continuation, reusable experience, and prospective learning without listing parallel topics.

- [ ] **Step 5: Add the contract to `npm test` and make it pass**

Set the verification order so the assertion always checks a fresh export:

```json
"test": "eslint . --ignore-pattern dist --ignore-pattern .next && GITHUB_PAGES=true next build && node --test scripts/homepage-content.test.mjs"
```

Run:

```bash
GITHUB_PAGES=true npm run build
node --test scripts/homepage-content.test.mjs
```

Expected: three passing tests.

- [ ] **Step 6: Commit the content model**

```bash
git add scripts/homepage-content.test.mjs package.json app/data/research.ts app/data/site.ts app/page.tsx
git commit -m "refactor: align homepage research positioning"
```

---

### Task 2: Synchronized Typewriter and Research Narrative

**Files:**
- Modify: `app/components/PageMotion.tsx`
- Rename: `app/components/ResearchFieldSelector.tsx` to `app/components/ResearchNarrative.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: the research-stage exports created in Task 1.
- Produces: `ResearchNarrative` with inline stage buttons and `research-stage-change` events.
- Produces: one automatic stage cycle shared by Hero, Research, and Canvas.

- [ ] **Step 1: Run lint against the temporary renamed API boundary**

Run:

```bash
npm run lint
```

Expected: FAIL while `page.tsx`, `PageMotion`, and the old selector still import retired research-theme names.

- [ ] **Step 2: Rewrite `PageMotion` around the stage model**

Use one `activeId` and one timer. Keep the outgoing clone and GSAP timeline, but set:

```ts
const typewriterMotion = {
  holdDurationMs: 7600,
  secondsPerCharacter: 0.022,
  minimumDuration: 0.42,
  maximumDuration: 0.9,
} as const;
```

The outgoing phrase must animate from `x: 0` to `x: min(112px, 18% of the window)` while fading. The incoming phrase begins at the left edge of the phrase window, types in place, and never uses a fixed clipping origin unrelated to its text width.

On every automatic transition, dispatch `RESEARCH_STAGE_EVENT` with `source: "hero-cycle"`. On a manual event, update the phrase immediately, reset the timer, and resume automatic cycling after the full hold duration.

Remove all querying and listeners for `[data-hero-theme]`.

- [ ] **Step 3: Replace the selector with one continuous narrative**

Move `ResearchFieldSelector.tsx` to `ResearchNarrative.tsx` and export `ResearchNarrative`.

Render this exact paragraph around the three stage buttons:

```text
My research asks how long-horizon agent histories can be transformed into compact, source-linked representations that preserve what matters for future decisions. I study process reconstruction from interaction traces, task-state abstraction for multi-session continuation, and whether verified experience can eventually support learning from recorded trajectories.
```

Click, focus, and mouse hover dispatch a manual stage event. Mouse leave clears the hover override without changing typography. Listen for automatic stage events so `aria-pressed` and `.is-active` remain synchronized.

Keep pointer parallax as CSS custom properties, but ignore non-mouse pointers.

- [ ] **Step 4: Run lint and content tests**

Run:

```bash
node --test scripts/homepage-content.test.mjs
npm run lint
```

Expected: both commands pass.

- [ ] **Step 5: Commit interaction ownership**

```bash
git add app/components/PageMotion.tsx app/components/ResearchNarrative.tsx app/components/ResearchFieldSelector.tsx app/page.tsx
git commit -m "refactor: synchronize research narrative motion"
```

---

### Task 3: Visual Semantics, Responsive Layout, and Full Verification

**Files:**
- Modify: `app/components/ResearchTrace.tsx`
- Modify: `app/components/ResearchNarrative.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: TRACE, STATE, and EXPERIENCE events.
- Produces: matching Hero canvas formations and Research background emphasis.

- [ ] **Step 1: Update canvas stage semantics**

In `ResearchTrace.tsx`:

- TRACE positions dispersed nodes in several partial paths;
- STATE converges nodes into evidence-linked checkpoints with two visible frontier branches;
- EXPERIENCE preserves verified paths and adds one understated feedback arc;
- retain transform and opacity animation only;
- retain subtle pointer influence without pulse, glow, cursor replacement, or size emphasis;
- draw a static frame under reduced motion.

- [ ] **Step 2: Update the Research background groups**

Rename memory-oriented SVG classes to experience-oriented names. Map active states as follows:

```text
TRACE -> trace layer
STATE -> checkpoint and frontier layers
EXPERIENCE -> verified-path and feedback layers
```

Do not add new cards, labels, captions, or explanatory panels.

- [ ] **Step 3: Rewrite targeted CSS**

In `app/globals.css`:

- introduce `.hero-research-statement` as the static Hero sentence;
- keep the typewriter window compact and single-line on desktop;
- remove all `.hero-research-sequence` rules;
- keep Research paragraph width at `min(100%, 1320px)`;
- retain Research font size around `clamp(24px, 2.35vw, 36px)` on desktop and `clamp(22px, 6.5vw, 28px)` on mobile;
- keep active keyword weight, line height, and letter spacing identical to inactive state;
- animate only color, underline, transform, and opacity;
- soften the background on mobile so it does not compete with text;
- disable typewriter, orbit, feedback, parallax, and canvas looping under reduced motion.

- [ ] **Step 4: Run complete repository verification**

Run:

```bash
npm test
```

Expected: content tests pass, ESLint passes, and the GitHub Pages production build succeeds.

- [ ] **Step 5: Inspect the built site in a browser**

Start the site on the LAN-capable development server:

```bash
npm run dev -- --hostname 0.0.0.0
```

Inspect desktop light, desktop dark, 390 px mobile, keyboard focus, and reduced-motion rendering. Confirm:

- Hero title does not wrap at desktop;
- typewriter motion enters from the left and exits smoothly right;
- stage changes remain readable and slower than the typing itself;
- Research paragraph is aligned and uses the available width;
- hover causes no font reflow or shaking;
- Hero, Research, and canvas show the same active stage;
- Publications begins directly with its title and list;
- Re-Searching is absent from visible copy.

- [ ] **Step 6: Run pre-flight source checks**

Run:

```bash
rg -n "Re-Searching|Previous work in retrieval|data-hero-theme|hero-research-sequence|[—–]" app scripts
git diff --check
```

Expected: no forbidden visible copy, retired controls, long dashes, or whitespace errors.

- [ ] **Step 7: Commit the visual refinement**

```bash
git add app/components/ResearchTrace.tsx app/components/ResearchNarrative.tsx app/globals.css
git commit -m "feat: visualize trajectory to experience progression"
```

---

## Final Review

- [ ] Compare implementation against every section of `docs/superpowers/specs/2026-08-09-research-positioning-design.md`.
- [ ] Run `git status --short` and confirm only intentional changes remain.
- [ ] Do not push or publish without an explicit deployment request.
