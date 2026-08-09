"use client";

import { useEffect, useRef, useState } from "react";
import {
  defaultResearchStageId,
  isResearchStageId,
  RESEARCH_STAGE_EVENT,
  researchNarrativeLead,
  researchStagesById,
  type ResearchStageEventDetail,
  type ResearchStageId,
} from "../data/research";

const narrativeSegments = [
  {
    id: "TRACE",
    before: `${researchNarrativeLead} `,
    after: ", ",
  },
  {
    id: "STATE",
    before: "",
    after: ", and ",
  },
  {
    id: "EXPERIENCE",
    before: "",
    after: ".",
  },
] as const satisfies readonly {
  id: ResearchStageId;
  before: string;
  after: string;
}[];

export function ResearchNarrative() {
  const [activeId, setActiveId] = useState<ResearchStageId>(
    defaultResearchStageId,
  );
  const [hoveredId, setHoveredId] = useState<ResearchStageId | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const focusedId = hoveredId ?? activeId;

  useEffect(() => {
    const handleStageChange = (event: Event) => {
      const id = (event as CustomEvent<ResearchStageEventDetail>).detail?.id;
      if (isResearchStageId(id)) setActiveId(id);
    };

    window.addEventListener(RESEARCH_STAGE_EVENT, handleStageChange);
    return () =>
      window.removeEventListener(RESEARCH_STAGE_EVENT, handleStageChange);
  }, []);

  const selectStage = (id: ResearchStageId) => {
    setActiveId(id);
    window.dispatchEvent(
      new CustomEvent<ResearchStageEventDetail>(RESEARCH_STAGE_EVENT, {
        detail: { id, source: "manual" },
      }),
    );
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const region = regionRef.current;
    if (!region) return;
    const rect = region.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    region.style.setProperty("--agenda-shift-x", `${x * 8}px`);
    region.style.setProperty("--agenda-shift-y", `${y * 6}px`);
  };

  const clearPointer = () => {
    setHoveredId(null);
    regionRef.current?.style.setProperty("--agenda-shift-x", "0px");
    regionRef.current?.style.setProperty("--agenda-shift-y", "0px");
  };

  return (
    <div
      className="research-agenda"
      data-focus={focusedId}
      ref={regionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointer}
      data-reveal
    >
      <div className="agenda-visual" aria-hidden="true">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none">
          <path
            className="agenda-backbone"
            d="M 48 302 C 214 302 246 226 390 226 C 530 226 574 316 710 316 C 840 316 888 244 1014 244 C 1076 244 1124 260 1162 286"
          />

          <g className="agenda-layer agenda-trace-layer">
            {[118, 158, 202, 246, 292, 334].map((x, index) => (
              <circle
                className="agenda-trace-token"
                cx={x}
                cy={[252, 323, 278, 344, 232, 296][index]}
                r={index % 3 === 0 ? 5 : 3}
                key={x}
                style={{ animationDelay: `${index * -0.43}s` }}
              />
            ))}
            <path d="M 118 252 L 202 278 L 292 232 L 390 226" />
            <path d="M 158 323 L 246 344 L 334 296 L 390 226" />
          </g>

          <g className="agenda-layer agenda-checkpoint-layer">
            <rect x="370" y="206" width="40" height="40" />
            <rect x="520" y="284" width="34" height="34" />
            <rect x="694" y="300" width="32" height="32" />
            <path d="M 410 226 C 460 226 476 300 520 300" />
            <path d="M 554 300 C 606 300 638 316 694 316" />
          </g>

          <g className="agenda-layer agenda-frontier-layer">
            <path d="M 726 316 C 818 316 854 252 936 226" />
            <path d="M 726 316 C 830 326 890 348 1018 326" />
            <circle cx="936" cy="226" r="8" />
            <circle cx="1018" cy="326" r="8" />
          </g>

          <g className="agenda-layer agenda-experience-layer">
            <path className="agenda-verified-path" d="M 390 226 C 484 228 500 300 537 300 C 618 300 644 316 710 316 C 816 316 858 252 936 226" />
            <circle className="agenda-evidence-item" cx="390" cy="226" r="6" />
            <circle className="agenda-evidence-item" cx="537" cy="300" r="6" />
            <circle className="agenda-evidence-item" cx="710" cy="316" r="6" />
            <circle className="agenda-evidence-item" cx="936" cy="226" r="6" />
            <path
              className="agenda-feedback"
              d="M 1018 326 C 900 442 636 446 537 320"
            />
          </g>
        </svg>
      </div>

      <div className="research-statement">
        <h2>Research</h2>
        <p>
          {narrativeSegments.map(({ id, before, after }) => (
            <span key={id}>
              {before}
              <span
                className={`research-stage-link${
                  id === focusedId ? " is-active" : ""
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={id === focusedId}
                onClick={() => selectStage(id)}
                onFocus={() => selectStage(id)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  selectStage(id);
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setHoveredId(id);
                  selectStage(id);
                }}
                onPointerLeave={() => setHoveredId(null)}
              >
                {researchStagesById[id].inlineLabel}
              </span>
              {after}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
