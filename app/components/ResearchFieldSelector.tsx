"use client";

import { useEffect, useState } from "react";

type ModeId = "MAS" | "AI4S" | "RAG";

export type ResearchArea = {
  code: "MAS" | "AI4S" | "IR";
  title: string;
  description: string;
  questions: string[];
};

const modeForArea = (area: ResearchArea): ModeId =>
  area.code === "IR" ? "RAG" : area.code;

export function ResearchFieldSelector({
  areas,
}: {
  areas: ResearchArea[];
}) {
  const [activeMode, setActiveMode] = useState<ModeId>("AI4S");

  useEffect(() => {
    const handleFieldChange = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: ModeId }>).detail?.mode;
      if (mode) setActiveMode(mode);
    };

    window.addEventListener("research-field-change", handleFieldChange);
    return () =>
      window.removeEventListener("research-field-change", handleFieldChange);
  }, []);

  const selectField = (mode: ModeId) => {
    if (mode === activeMode) return;
    setActiveMode(mode);
    window.dispatchEvent(
      new CustomEvent("research-field-select", { detail: { mode } }),
    );
  };

  return (
    <div
      className="research-grid"
      role="group"
      aria-label="Select a research field"
    >
      {areas.map((area, index) => {
        const mode = modeForArea(area);
        const isActive = activeMode === mode;

        return (
          <button
            className={`research-card${isActive ? " is-canvas-related" : ""}`}
            key={area.code}
            type="button"
            aria-pressed={isActive}
            data-research-mode={mode}
            data-field-tone={mode}
            data-reveal
            onClick={() => selectField(mode)}
          >
            <span className="research-card-head">
              <span className="area-number">0{index + 1}</span>
              <span className="area-code">{area.code}</span>
            </span>
            <span className="research-card-title" role="heading" aria-level={3}>
              {area.title}
            </span>
            <span className="research-card-description">
              {area.description}
            </span>
            <span className="research-card-list">
              {area.questions.map((question) => (
                <span className="research-card-topic" key={question}>
                  {question}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
