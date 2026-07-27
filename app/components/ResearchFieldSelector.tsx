"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ModeId = "MAS" | "AI4S" | "RAG";

export type ResearchArea = {
  code: "MAS" | "AI4S" | "IR";
  title: string;
  description: string;
  questions: string[];
};

const modeForArea = (area: ResearchArea): ModeId =>
  area.code === "IR" ? "RAG" : area.code;

const systemOrder: ModeId[] = ["RAG", "MAS", "AI4S"];

const systemLayers: Record<
  ModeId,
  {
    action: string;
    level: string;
    radius: number;
  }
> = {
  RAG: {
    action: "Ground",
    level: "Evidence core",
    radius: 74,
  },
  MAS: {
    action: "Coordinate",
    level: "Coordination layer",
    radius: 136,
  },
  AI4S: {
    action: "Transform",
    level: "Inquiry horizon",
    radius: 202,
  },
};

const agentNodes = [
  [300, 124],
  [418, 192],
  [418, 328],
  [300, 396],
  [182, 328],
  [182, 192],
];

export function ResearchFieldSelector({
  areas,
}: {
  areas: ResearchArea[];
}) {
  const [activeMode, setActiveMode] = useState<ModeId>("AI4S");
  const [previewMode, setPreviewMode] = useState<ModeId | null>(null);
  const [detailMode, setDetailMode] = useState<ModeId>("AI4S");
  const [detailVisible, setDetailVisible] = useState(true);
  const activeModeRef = useRef<ModeId>("AI4S");
  const detailSwapTimerRef = useRef<number | null>(null);
  const detailRevealFrameRef = useRef<number | null>(null);

  const transitionToMode = useCallback((mode: ModeId) => {
    if (mode === activeModeRef.current) return;

    activeModeRef.current = mode;
    setActiveMode(mode);
    setDetailVisible(false);

    if (detailSwapTimerRef.current !== null) {
      window.clearTimeout(detailSwapTimerRef.current);
    }
    if (detailRevealFrameRef.current !== null) {
      window.cancelAnimationFrame(detailRevealFrameRef.current);
    }

    detailSwapTimerRef.current = window.setTimeout(() => {
      setDetailMode(mode);
      detailRevealFrameRef.current = window.requestAnimationFrame(() => {
        setDetailVisible(true);
      });
    }, 220);
  }, []);

  useEffect(() => {
    const handleFieldChange = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: ModeId }>).detail?.mode;
      if (mode) transitionToMode(mode);
    };

    window.addEventListener("research-field-change", handleFieldChange);
    return () => {
      window.removeEventListener("research-field-change", handleFieldChange);
      if (detailSwapTimerRef.current !== null) {
        window.clearTimeout(detailSwapTimerRef.current);
      }
      if (detailRevealFrameRef.current !== null) {
        window.cancelAnimationFrame(detailRevealFrameRef.current);
      }
    };
  }, [transitionToMode]);

  const selectField = (mode: ModeId) => {
    setPreviewMode(null);
    if (mode === activeModeRef.current) return;
    transitionToMode(mode);
    window.dispatchEvent(
      new CustomEvent("research-field-select", { detail: { mode } }),
    );
  };

  const visualMode = previewMode ?? activeMode;
  const visualDepth = systemOrder.indexOf(visualMode);
  const detailArea = areas.find(
    (area) => modeForArea(area) === detailMode,
  ) ?? areas[0]!;
  const detailLayer = systemLayers[detailMode];
  const activeIndex = systemOrder.indexOf(activeMode);

  return (
    <div
      className="research-architecture"
      data-active-mode={activeMode}
      data-reveal
      onPointerLeave={() => {
        setPreviewMode(null);
      }}
    >
      <div className="research-architecture-header">
        <span>Research architecture</span>
        <span aria-live="polite">
          0{activeIndex + 1} <i aria-hidden="true">/</i> 03
        </span>
      </div>

      <nav className="research-index" aria-label="Research layers">
        {systemOrder.map((mode, index) => {
          const layer = systemLayers[mode];
          const isActive = activeMode === mode;

          return (
            <button
              className={isActive ? "is-active is-canvas-related" : ""}
              key={mode}
              type="button"
              aria-pressed={isActive}
              data-research-mode={mode}
              onClick={() => selectField(mode)}
              onPointerEnter={() => setPreviewMode(mode)}
              onPointerLeave={() => setPreviewMode(null)}
              onFocus={() => setPreviewMode(mode)}
              onBlur={() => setPreviewMode(null)}
            >
              <span>0{index + 1}</span>
              <strong>{layer.action}</strong>
              <small>{layer.level}</small>
            </button>
          );
        })}
      </nav>

      <div className="research-stage">
        <div
          className="research-visual"
          data-visual-mode={visualMode}
          aria-hidden="true"
        >
          <svg
            className="research-visual-art"
            viewBox="0 0 600 520"
            aria-hidden="true"
          >
            <line
              className="research-visual-axis"
              x1="300"
              y1="42"
              x2="300"
              y2="478"
            />
            <line
              className="research-visual-axis"
              x1="82"
              y1="260"
              x2="518"
              y2="260"
            />

            <g className="research-visual-orbit-plane">
              {[...systemOrder].reverse().map((mode) => {
                const layer = systemLayers[mode];
                const index = systemOrder.indexOf(mode);
                const isEstablished = index <= visualDepth;
                const isCurrent = visualMode === mode;

                return (
                  <g
                    className={`research-visual-layer research-visual-layer-${mode.toLowerCase()}${
                      isEstablished ? " is-established" : ""
                    }${isCurrent ? " is-current" : ""}`}
                    key={mode}
                  >
                    <circle
                      className="research-visual-ring"
                      cx="300"
                      cy="260"
                      r={layer.radius}
                    />
                    <circle
                      className="research-visual-progress"
                      cx="300"
                      cy="260"
                      r={layer.radius}
                      pathLength="1"
                    />
                  </g>
                );
              })}

              <g className="research-visual-agent-nodes">
                {agentNodes.map(([cx, cy], index) => (
                  <circle cx={cx} cy={cy} r="5" key={`${cx}-${cy}-${index}`} />
                ))}
              </g>

              <path
                className="research-visual-inquiry"
                pathLength="1"
                d="M 170 105 A 202 202 0 0 1 494 205"
              />
              <path
                className="research-visual-inquiry-cap"
                d="M 486 193 L 495 205 L 480 208"
              />
              <circle
                className="research-visual-orbit-marker"
                cx="300"
                cy="58"
                r="3"
              />
            </g>

            <g className="research-visual-core">
              <circle cx="300" cy="260" r="8" />
              <circle cx="300" cy="260" r="22" />
            </g>
          </svg>
        </div>

        <article
          className={`research-detail${detailVisible ? " is-visible" : ""}`}
          aria-live="polite"
        >
          <div className="research-detail-head">
            <span>{detailLayer.level}</span>
            <span>{detailMode}</span>
          </div>
          <h3>{detailArea.title}</h3>
          <p>{detailArea.description}</p>
          <ul>
            {detailArea.questions.map((question, index) => (
              <li key={question}>
                <span>0{index + 1}</span>
                {question}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
