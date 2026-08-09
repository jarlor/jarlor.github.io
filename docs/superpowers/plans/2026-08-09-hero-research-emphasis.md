# Hero and Research Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Join the Hero typewriter to a stable sentence lead and shorten the Research section into one scannable sentence with three synchronized visual anchors.

**Architecture:** Keep all stage-specific public copy in `app/data/research.ts`. The server-rendered Hero and the client-side Research narrative consume the same stage records, while `PageMotion` continues to own typewriter timing and the existing custom event synchronizes Hero, Research, and Canvas state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, native CSS, GSAP, Node test runner.

## Global Constraints

- Preserve the existing light and dark theme tokens, portrait, publications, navigation, and contact sections.
- Keep the title `Long-Horizon LLM Agents` on one line at 390px and desktop widths.
- Do not expose Re-Searching.
- Do not add cards, pills, numbering, hover scaling, hover weight changes, or new dependencies.
- Retain automatic cycling, manual selection, Canvas synchronization, keyboard interaction, and reduced-motion behavior.
- Keep visible copy free of em dashes and en dashes.

---

### Task 1: Continuous Hero and Concise Research Narrative

**Files:**
- Modify: `scripts/homepage-content.test.mjs`
- Modify: `app/data/research.ts`
- Modify: `app/page.tsx`
- Modify: `app/components/PageMotion.tsx`
- Modify: `app/components/ResearchNarrative.tsx`
- Modify: `app/globals.css`
- Test: `scripts/homepage-content.test.mjs`

**Interfaces:**
- Consumes: existing `ResearchStage`, `RESEARCH_STAGE_EVENT`, `[data-phrases]`, and `.research-stage-link` contracts.
- Produces: `heroResearchLead`, `researchNarrativeLead`, revised `heroPhrase` and `inlineLabel` values, and a single `.hero-research-statement` typewriter unit.

- [ ] **Step 1: Write the failing rendered-homepage tests**

Update `scripts/homepage-content.test.mjs` to assert that the rendered page contains:

```js
for (const text of [
  "My work focuses on",
  "reconstructing research processes from interaction traces.",
  "preserving decision-relevant task state across sessions.",
  "evaluating when recorded trajectories can guide future decisions.",
  "My research connects three problems:",
  "whether recorded trajectories can become reusable experience",
]) {
  assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

assert.doesNotMatch(
  html,
  /I study how long-horizon interaction traces can be transformed/,
);
assert.doesNotMatch(
  html,
  /My research asks how long-horizon agent histories can be transformed/,
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test scripts/homepage-content.test.mjs
```

Expected: the approved Hero lead and revised Research sentence assertions fail because the rendered export still contains the old copy.

- [ ] **Step 3: Centralize the approved copy**

In `app/data/research.ts`, add:

```ts
export const heroResearchLead = "My work focuses on";
export const researchNarrativeLead = "My research connects three problems:";
```

Replace the three stage values with:

```ts
{
  id: "TRACE",
  heroPhrase: "reconstructing research processes from interaction traces.",
  inlineLabel: "process reconstruction from interaction traces",
},
{
  id: "STATE",
  heroPhrase: "preserving decision-relevant task state across sessions.",
  inlineLabel: "task-state abstraction for multi-session continuation",
},
{
  id: "EXPERIENCE",
  heroPhrase: "evaluating when recorded trajectories can guide future decisions.",
  inlineLabel: "whether recorded trajectories can become reusable experience",
},
```

- [ ] **Step 4: Merge the Hero text into one typewriter paragraph**

In `app/page.tsx`, remove the static statement plus separate `.hero-thesis`. Render one `.hero-research-statement` containing the stable lead and the existing phrase window. Build the accessible label from the lead plus all three clauses.

In `app/components/PageMotion.tsx`, reveal only `.hero-research-statement` for this unit and remove the retired `.hero-thesis` selector.

- [ ] **Step 5: Replace the Research paragraph with the concise sentence**

In `app/components/ResearchNarrative.tsx`, use `researchNarrativeLead` before the three inline stage links. Join the links with commas and `, and ` so punctuation remains in normal inline flow.

- [ ] **Step 6: Refine typography without layout shifts**

In `app/globals.css`:

- make `.hero-research-statement` a stable wrapping flex row on desktop and a block on mobile;
- give the lead and dynamic clause one display-family typographic system;
- remove retired `.hero-thesis` rules;
- keep every `.research-stage-link` at one stable weight in active and inactive states;
- use accent color and underline thickness for active emphasis;
- modestly reduce Research minimum height to match the shorter sentence;
- preserve overflow clipping, typewriter caret, and reduced-motion rules.

- [ ] **Step 7: Run the full suite and verify GREEN**

Run:

```bash
npm test
```

Expected: ESLint passes, the GitHub Pages production export succeeds, and all Node tests pass.

- [ ] **Step 8: Verify in a real browser**

At desktop and 390px widths, verify:

- Hero lead and active clause read as one sentence;
- automatic cycling advances all three stages;
- outgoing text fades right and incoming text types from the left;
- Research fits in one concise statement with three visible anchors;
- manual pointer and keyboard selection synchronize Hero, Research, and background;
- paragraph boxes do not change dimensions between stages;
- no horizontal overflow appears;
- both light and dark themes remain legible.

- [ ] **Step 9: Commit the implementation**

```bash
git add app scripts docs/superpowers/plans/2026-08-09-hero-research-emphasis.md
git commit -m "refactor: connect hero and research narrative"
```
