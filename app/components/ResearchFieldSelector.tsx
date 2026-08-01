"use client";

import { useEffect, useRef, useState } from "react";
import {
  defaultResearchThemeId,
  isResearchThemeId,
  RESEARCH_THEME_EVENT,
  researchThemes,
  researchThemesById,
  type ResearchThemeEventDetail,
  type ResearchThemeId,
} from "../data/research";

export function ResearchFieldSelector() {
  const [activeId, setActiveId] = useState<ResearchThemeId>(
    defaultResearchThemeId,
  );
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const id = (event as CustomEvent<ResearchThemeEventDetail>).detail?.id;
      if (!isResearchThemeId(id)) return;
      setActiveId(id);
    };

    window.addEventListener(RESEARCH_THEME_EVENT, syncTheme);
    return () => window.removeEventListener(RESEARCH_THEME_EVENT, syncTheme);
  }, []);

  const activeTheme = researchThemesById[activeId];

  const handleManualSelect = (id: ResearchThemeId) => {
    setActiveId(id);
    window.dispatchEvent(
      new CustomEvent<ResearchThemeEventDetail>(RESEARCH_THEME_EVENT, {
        detail: { id, source: "manual" },
      }),
    );
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const region = regionRef.current;
    if (!region) return;
    const rect = region.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    region.style.setProperty("--agenda-shift-x", `${x * 14}px`);
    region.style.setProperty("--agenda-shift-y", `${y * 10}px`);
  };

  const clearPointer = () => {
    regionRef.current?.style.setProperty("--agenda-shift-x", "0px");
    regionRef.current?.style.setProperty("--agenda-shift-y", "0px");
  };

  return (
    <div
      className="research-agenda"
      data-active-theme={activeId}
      ref={regionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointer}
      data-reveal
    >
      <div className="agenda-visual" aria-hidden="true">
        <svg viewBox="0 0 1200 500" preserveAspectRatio="none">
          <path
            className="agenda-backbone"
            d="M 50 302 C 218 302 240 226 390 226 C 542 226 560 318 710 318 C 850 318 884 220 1018 220 C 1080 220 1128 246 1160 270"
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
            <rect x="694" y="302" width="32" height="32" />
            <path d="M 410 226 C 460 226 476 300 520 300" />
            <path d="M 554 300 C 606 300 638 318 694 318" />
          </g>

          <g className="agenda-layer agenda-memory-layer">
            <circle className="agenda-memory-orbit" cx="710" cy="318" r="96" />
            <circle className="agenda-memory-orbit" cx="710" cy="318" r="62" />
            <circle className="agenda-memory-orbit" cx="710" cy="318" r="28" />
            <circle className="agenda-memory-item" cx="710" cy="222" r="5" />
            <circle className="agenda-memory-item" cx="772" cy="318" r="4" />
            <circle className="agenda-memory-item" cx="668" cy="370" r="4" />
          </g>

          <g className="agenda-layer agenda-learning-layer">
            <path className="agenda-branch" d="M 726 318 C 820 318 858 250 936 226" />
            <path className="agenda-branch" d="M 726 318 C 830 328 886 332 1018 300" />
            <path className="agenda-branch" d="M 726 318 C 834 350 882 405 1042 392" />
            <circle cx="936" cy="226" r="8" />
            <circle cx="1018" cy="300" r="8" />
            <circle cx="1042" cy="392" r="8" />
            <path
              className="agenda-feedback"
              d="M 1042 392 C 890 468 602 454 520 324"
            />
          </g>
        </svg>
      </div>

      <div className="agenda-copy" aria-live="polite">
        <span className="agenda-status">{activeTheme.status}</span>
        <h3 key={`${activeTheme.id}-title`}>{activeTheme.title}</h3>
        <p key={`${activeTheme.id}-description`}>{activeTheme.description}</p>
        <div className="agenda-methods" key={`${activeTheme.id}-methods`}>
          {activeTheme.methods.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>
      </div>

      <div className="agenda-controls" aria-label="Research themes">
        {researchThemes.map((theme) => (
          <button
            className={theme.id === activeId ? "is-active" : undefined}
            type="button"
            key={theme.id}
            aria-pressed={theme.id === activeId}
            onClick={() => handleManualSelect(theme.id)}
          >
            <span>{theme.shortTitle}</span>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
