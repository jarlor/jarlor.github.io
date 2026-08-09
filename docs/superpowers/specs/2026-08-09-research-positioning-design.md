# Research Positioning Redesign

## Purpose

Refine the academic homepage so that it presents one coherent research program rather than three parallel topic labels. The redesign must preserve the current editorial visual language, dual-theme system, portrait, publications, contact information, routes, and navigation.

The public page should make this progression legible:

```text
interaction traces
-> task-level state
-> verified, reusable experience
-> prospective learning
```

The page must not name Re-Searching or present graph construction, memory, retrieval, multi-agent systems, or reinforcement learning as independent research identities.

## Design Read

This is a targeted redesign of an academic portfolio for researchers, prospective collaborators, and advisors. Preserve the calm, scientific, editorial character of the current site.

- Design variance: 6
- Motion intensity: 5
- Visual density: 3
- Theme: existing system-aware light and dark themes
- Accent: retain the existing restrained teal palette
- Shape language: retain the current sharp, low-radius system

## Information Architecture

The homepage order remains unchanged:

1. Hero
2. Research
3. Publications
4. Contact

No About page, project section, product page, CV link, or additional research-detail route is introduced.

## Hero

The Hero continues to carry the portrait, academic facts, name, slogan, and academic links. Its research content changes as follows.

### Research title

```text
Long-Horizon LLM Agents
```

This remains the broad field-level identity and should stay on one line at normal desktop widths.

### Research statement

```text
I study how long-horizon interaction traces can be transformed into decision-relevant representations for research agents.
```

The sentence is static. It establishes the research problem before any animated language appears.

### Typewriter progression

The current three independent research claims are replaced by three short stages:

```text
from interaction traces
to task-level state
toward reusable experience
```

The phrases use the established typewriter transition. A new phrase enters from the left while the completed phrase moves smoothly to the right and fades. The typing speed may be slightly faster than the current implementation, but the completed phrase remains readable before the next transition.

The stage buttons beneath the typewriter are removed. The progression is explanatory, not a topic selector.

### Motion behavior

- The three stages cycle automatically.
- The cycle emits the existing research-theme event so the Hero canvas and Research section remain synchronized.
- A pointer or keyboard interaction with a Research keyword temporarily selects the corresponding stage.
- Automatic cycling resumes after the interaction ends.
- Reduced-motion mode displays the complete static research statement and disables typewriter movement.

## Research Section

The Research section presents one continuous statement instead of switchable descriptions or topic cards:

> My research asks how long-horizon agent histories can be transformed into compact, source-linked representations that preserve what matters for future decisions. I study process reconstruction from interaction traces, task-state abstraction for multi-session continuation, and whether verified experience can eventually support learning from recorded trajectories.

Three phrases are interactive within the paragraph:

- `process reconstruction from interaction traces`
- `task-state abstraction for multi-session continuation`
- `verified experience`

They receive a stable accent color and restrained underline. Hover and focus must not change font weight, line height, or letter spacing, so the paragraph never shifts or shakes.

The section contains no separate descriptions, tabs, cards, numbered stages, or project names.

## Background Narrative

The existing research graphic is retained as a quiet background, but its semantics change to match the research program.

1. Trace phase: dispersed interaction events and partial paths.
2. State phase: evidence converges into a small set of task checkpoints, with more than one active frontier allowed.
3. Experience phase: verified paths become reusable structures, while an understated feedback path suggests future learning.

The graphic remains subordinate to the paragraph. Phase changes animate only transform and opacity, use smooth easing, and avoid pulses, glows, cursor attraction, or abrupt color changes. Pointer parallax remains subtle and is disabled on touch and under reduced motion.

## Research Boundaries

Visible copy must preserve these distinctions:

- Scientific workflows are the primary setting, not a claim to solve all of AI for Science.
- Process representations are inferred and source-linked, not automatically causal graphs or MDP states.
- Reusable experience is a research object under investigation, not an established standalone field.
- Policy learning is prospective. The page must not imply completed reinforcement-learning experiments.
- Retrieval, graph representations, and multi-agent interaction are methods or settings rather than parallel headline topics.
- Re-Searching is not named or described.

## Publications and Contact

Publication entries, ordering, authorship highlighting, figures, modal behavior, and links remain unchanged.

The redundant Publications introduction is removed. The section begins directly with its title and publication list.

The Contact statement is adjusted only for consistency:

```text
I welcome discussions on long-horizon agents, task-state representation, and learning from recorded interactions.
```

The heading `Open to Research Collaborations` remains unchanged.

## Component Responsibilities

- `app/data/research.ts` defines the three semantic stages and their public phrases. It remains the single source of truth for Hero, Research, and canvas synchronization.
- `ResearchTrace` renders only the background process visualization and reacts to stage changes.
- `PageMotion` owns the automatic Hero typewriter sequence and event dispatch. It must not duplicate research copy.
- `ResearchFieldSelector` is renamed or simplified to reflect its new role as a continuous research narrative rather than a selector.
- `app/page.tsx` preserves the page structure and supplies static semantic HTML.

No new animation or state-management dependency is required.

## Responsive and Accessible Behavior

- The research title stays on one line whenever the desktop container can support it.
- Mobile uses a single-column Hero and keeps the portrait secondary to the research statement.
- The Research paragraph uses the full readable content width rather than an artificial half-width column.
- Interactive phrases are real buttons with visible keyboard focus and correct `aria-pressed` state.
- The background graphic is decorative and hidden from assistive technology.
- Light and dark themes retain equivalent hierarchy and contrast.
- Reduced-motion mode contains no automatic typing, looping canvas motion, or animated phase transition.

## Verification

Run the repository verification command:

```bash
npm test
```

Then inspect:

- desktop light theme;
- desktop dark theme;
- mobile width around 390 px;
- keyboard focus through Research keywords;
- reduced-motion rendering;
- Hero title and typewriter wrapping;
- automatic synchronization between Hero, Research emphasis, and background phases;
- absence of `Re-Searching`, unsupported RL claims, em dashes, layout shifts, and redundant Publications copy.

## Success Criteria

A first-time academic visitor should understand, without operating a tab interface, that the research starts from long-horizon interaction traces, reconstructs decision-relevant task state, and studies whether verified experience can support continuation and eventual learning.
