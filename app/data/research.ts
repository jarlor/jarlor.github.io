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

export const researchStages = [
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
