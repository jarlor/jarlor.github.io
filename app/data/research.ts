export type ResearchThemeId = "STATE" | "MEMORY" | "LEARNING";
export type ResearchThemeSource = "hero-cycle" | "manual";

export type ResearchTheme = {
  id: ResearchThemeId;
  heroStage: string;
  shortTitle: string;
  heroPhrase: string;
};

export type ResearchThemeEventDetail = {
  id: ResearchThemeId;
  source: ResearchThemeSource;
};

export const RESEARCH_THEME_EVENT = "research-theme-change";

export const researchThemes = [
  {
    id: "STATE",
    heroStage: "Process graph",
    shortTitle: "Process-Graph Representation",
    heroPhrase:
      "I reconstruct task-level research processes from agent interaction traces.",
  },
  {
    id: "MEMORY",
    heroStage: "Task state",
    shortTitle: "Task-State Abstraction",
    heroPhrase:
      "I study what task state is required for reliable cross-session continuation.",
  },
  {
    id: "LEARNING",
    heroStage: "Policy learning",
    shortTitle: "Policy Learning",
    heroPhrase:
      "I investigate when recorded trajectories can support policy learning.",
  },
] as const satisfies readonly ResearchTheme[];

export const researchThemeIds = researchThemes.map((theme) => theme.id);
export const defaultResearchThemeId = researchThemes[0].id;
export const researchThemesById = Object.fromEntries(
  researchThemes.map((theme) => [theme.id, theme]),
) as Record<ResearchThemeId, (typeof researchThemes)[number]>;

export function isResearchThemeId(value: unknown): value is ResearchThemeId {
  return (
    typeof value === "string" &&
    researchThemeIds.includes(value as ResearchThemeId)
  );
}
