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
  const [activeMode, setActiveMode] = useState<ModeId>("MAS");

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
          <article
            className={`research-card${isActive ? " is-canvas-related" : ""}`}
            key={area.code}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            data-research-mode={mode}
            data-field-tone={mode}
            data-reveal
            onClick={() => selectField(mode)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              selectField(mode);
            }}
          >
            <header>
              <span className="area-number">0{index + 1}</span>
              <span className="area-code">{area.code}</span>
            </header>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
            <ul>
              {area.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
