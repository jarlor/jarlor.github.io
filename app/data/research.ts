export type ResearchStageId = "TRACE" | "STATE" | "EXPERIENCE";
export type ResearchStageSource = "hero-cycle" | "manual";

export type ResearchStage = {
  id: ResearchStageId;
  heroPhrase: string;
  inlineLabel: string;
};

export type ResearchStageEventDetail = {
  id: ResearchStageId;
  source: ResearchStageSource;
};

export const RESEARCH_STAGE_EVENT = "research-stage-change";
export const heroResearchLead = "My work focuses on";
export const researchNarrativeLead = "My research connects three problems:";

export const researchStages = [
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
    heroPhrase:
      "evaluating when recorded trajectories can guide future decisions.",
    inlineLabel: "whether recorded trajectories can become reusable experience",
  },
] as const satisfies readonly ResearchStage[];

export const researchStageIds = researchStages.map((stage) => stage.id);
export const defaultResearchStageId = researchStages[0].id;
export const researchStagesById = Object.fromEntries(
  researchStages.map((stage) => [stage.id, stage]),
) as Record<ResearchStageId, (typeof researchStages)[number]>;

export function isResearchStageId(value: unknown): value is ResearchStageId {
  return (
    typeof value === "string" &&
    researchStageIds.includes(value as ResearchStageId)
  );
}
