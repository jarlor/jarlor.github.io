export type ResearchThemeId = "STATE" | "MEMORY" | "LEARNING";
export type ResearchThemeSource = "hero-cycle" | "manual";

export type ResearchTheme = {
  id: ResearchThemeId;
  shortTitle: string;
  title: string;
  status: string;
  description: string;
  methods: readonly string[];
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
    shortTitle: "Process-Graph Representation",
    title: "Graph-Structured Representation of Long-Horizon Research Processes",
    status: "Current Focus",
    description:
      "I reconstruct task checkpoints and execution structure from heterogeneous research-agent traces into graphs whose paths correspond to task-level trajectories.",
    methods: ["Execution Traces", "Process Graphs", "Task-Level Trajectories"],
    heroPhrase:
      "how execution traces can support graph-structured process representations.",
  },
  {
    id: "MEMORY",
    shortTitle: "Task-State Abstraction",
    title: "Task-State Abstraction for Multi-Session Decision-Making",
    status: "Connected Problem",
    description:
      "I study which goals, evidence, artifacts, and unresolved issues must be reconstructed into decision-relevant task state for agents operating across sessions.",
    methods: ["Task-State Abstraction", "Context Construction", "Decision-Making"],
    heroPhrase: "what task state must be reconstructed across sessions.",
  },
  {
    id: "LEARNING",
    shortTitle: "Policy Learning",
    title: "Policy Learning from Recorded Agent Trajectories",
    status: "Prospective Direction",
    description:
      "My longer-term research asks when recorded trajectories can support policy learning, given explicit feedback, reliable credit assignment, and adequate trajectory coverage.",
    methods: ["Policy Learning", "Credit Assignment", "Trajectory Coverage"],
    heroPhrase: "when recorded trajectories can support policy learning.",
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
