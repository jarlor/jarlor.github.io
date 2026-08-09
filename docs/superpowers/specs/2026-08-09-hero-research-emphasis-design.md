# Hero and Research Emphasis Design

## Goal

Make the Hero typewriter read as part of one sentence, and make the Research section scannable without returning to cards, tabs, or a long explanatory paragraph.

## Hero

The current static research sentence and the separate typewriter fragment become one semantic and visual unit.

Stable lead:

> My work focuses on

Rotating clauses:

1. `reconstructing research processes from interaction traces.`
2. `preserving decision-relevant task state across sessions.`
3. `evaluating when recorded trajectories can guide future decisions.`

The lead and rotating clause share one paragraph and one font family. The lead uses the normal copy color; the rotating clause uses the existing accent. Desktop keeps them on one line when width permits. Mobile allows the rotating clause to wrap beneath the lead without becoming a separate paragraph.

The existing typewriter transition remains: the outgoing clause moves gently to the right and fades while the incoming clause types from the left. Automatic cycling, manual Research selection, Canvas synchronization, and reduced-motion behavior remain unchanged.

## Research

Replace the long paragraph with one concise sentence:

> My research connects three problems: process reconstruction from interaction traces, task-state abstraction for multi-session continuation, and whether recorded trajectories can become reusable experience.

The three research phrases remain interactive inline text. They use a stable, slightly stronger weight, a thin underline, and restrained accent color. The active phrase receives a clearer accent and underline, without changing font weight, size, or position. Automatic cycling and background synchronization remain available without requiring interaction.

## Content Model

Hero clauses and Research phrases continue to come from `app/data/research.ts`. The Hero lead and Research lead also live in that module so visible research language has one source of truth.

## Responsive and Accessibility Rules

- No horizontal overflow at 390px.
- Hero title remains one line at 390px and desktop widths.
- Research phrases remain true inline flow content, including punctuation.
- Interactive phrases keep keyboard access and `aria-pressed` state.
- Reduced motion presents a static phrase and instant manual changes.
- Light and dark themes use the existing single accent color.
- Re-Searching remains absent from public copy.

## Verification

- Rendered HTML contains the approved Hero lead, three rotating clauses, concise Research sentence, and three interactive phrases.
- Rendered HTML omits the retired static Hero statement and retired long Research paragraph.
- Production build, TypeScript, ESLint, and all regression tests pass.
- Real-browser checks cover desktop and 390px mobile layouts, automatic cycling, manual selection, light mode, dark mode, and LAN access.
