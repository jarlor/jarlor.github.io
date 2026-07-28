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
const autoRotationDuration = 5600;

const systemLayers: Record<
  ModeId,
  {
    action: string;
    level: string;
  }
> = {
  RAG: {
    action: "Ground",
    level: "Evidence core",
  },
  MAS: {
    action: "Coordinate",
    level: "Coordination layer",
  },
  AI4S: {
    action: "Investigate",
    level: "Scientific inquiry",
  },
};

const evidencePaths = [
  "M 16 198 C 122 218 218 292 310 344",
  "M 42 242 C 142 254 226 306 310 344",
  "M 12 286 C 132 292 220 322 310 344",
  "M 54 332 C 154 328 232 336 310 344",
  "M 14 380 C 130 372 222 356 310 344",
  "M 48 430 C 144 406 226 370 310 344",
  "M 80 478 C 172 432 240 382 310 344",
  "M 122 520 C 196 460 252 396 310 344",
];

const evidenceParticles = [
  [52, 208, 3],
  [92, 258, 2.5],
  [126, 302, 3.5],
  [168, 230, 2.4],
  [194, 396, 3],
  [230, 322, 2.5],
  [254, 372, 3.5],
  [280, 336, 2.5],
];

const networkNodes = [
  [486, 286, 6],
  [550, 232, 5],
  [628, 264, 7],
  [704, 218, 5],
  [764, 292, 6],
  [724, 378, 6],
  [642, 416, 5],
  [556, 380, 5],
  [632, 336, 10],
];

const inquiryContours = [
  "M 836 278 C 892 196 1010 184 1094 250 C 1170 310 1144 420 1064 454 C 976 490 884 434 894 350 C 902 292 968 254 1028 278 C 1082 300 1092 360 1052 392 C 1008 426 942 402 948 352",
  "M 858 304 C 910 236 1002 226 1068 274 C 1126 318 1112 398 1052 426 C 988 456 920 418 924 356 C 928 314 972 286 1016 298 C 1056 310 1070 350 1044 378",
  "M 886 330 C 928 282 994 276 1042 306 C 1084 334 1078 388 1036 408 C 990 430 944 402 946 360 C 948 332 976 316 1004 322",
  "M 916 354 C 946 324 990 322 1020 342 C 1046 360 1042 392 1014 404 C 984 416 956 398 958 372",
];

const inquiryBranches = [
  "M 758 334 C 834 322 874 280 920 242 C 984 188 1074 210 1178 154",
  "M 758 338 C 846 340 910 330 970 338 C 1044 346 1108 326 1190 300",
  "M 758 342 C 834 360 878 402 930 438 C 998 486 1080 468 1170 520",
];

const inquiryNodes = [
  [842, 324, 4],
  [902, 264, 5],
  [968, 216, 4],
  [1042, 232, 5],
  [1110, 188, 4],
  [920, 338, 5],
  [986, 338, 4],
  [1060, 340, 6],
  [1146, 314, 4],
  [918, 424, 4],
  [1000, 470, 5],
  [1090, 486, 4],
];

export function ResearchFieldSelector({
  areas,
}: {
  areas: ResearchArea[];
}) {
  const [activeMode, setActiveMode] = useState<ModeId>("AI4S");
  const [previewMode, setPreviewMode] = useState<ModeId | null>(null);
  const activeModeRef = useRef<ModeId>("AI4S");
  const resetRotationRef = useRef<() => void>(() => undefined);

  const transitionToMode = useCallback((mode: ModeId) => {
    if (mode === activeModeRef.current) return;
    activeModeRef.current = mode;
    setActiveMode(mode);
  }, []);

  useEffect(() => {
    const handleFieldChange = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: ModeId }>).detail?.mode;
      if (mode) transitionToMode(mode);
    };

    window.addEventListener("research-field-change", handleFieldChange);
    return () => {
      window.removeEventListener("research-field-change", handleFieldChange);
    };
  }, [transitionToMode]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let rotationTimer: number | undefined;
    let rotationEnabled = false;
    const visibleRegions = new Map<Element, boolean>();
    const rotationRegions = [
      document.querySelector(".hero"),
      document.querySelector("#research"),
    ].filter((region): region is Element => region !== null);

    const scheduleRotation = () => {
      if (rotationTimer) window.clearTimeout(rotationTimer);
      if (!rotationEnabled || document.hidden) return;

      rotationTimer = window.setTimeout(() => {
        const currentIndex = systemOrder.indexOf(activeModeRef.current);
        const nextMode =
          systemOrder[(currentIndex + 1) % systemOrder.length] ?? "AI4S";
        transitionToMode(nextMode);
        document.documentElement.dataset.researchInteraction = "auto";
        window.dispatchEvent(
          new CustomEvent("research-field-select", {
            detail: { mode: nextMode, source: "auto" },
          }),
        );
        scheduleRotation();
      }, autoRotationDuration);
    };
    resetRotationRef.current = scheduleRotation;

    const regionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRegions.set(entry.target, entry.isIntersecting);
        });
        const nextRotationEnabled = Array.from(
          visibleRegions.values(),
        ).some(Boolean);

        if (rotationEnabled !== nextRotationEnabled) {
          rotationEnabled = nextRotationEnabled;
          scheduleRotation();
        }
      },
      { threshold: 0.08 },
    );

    rotationRegions.forEach((region) => {
      visibleRegions.set(region, false);
      regionObserver.observe(region);
    });

    const handleVisibilityChange = () => scheduleRotation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rotationTimer) window.clearTimeout(rotationTimer);
      resetRotationRef.current = () => undefined;
      regionObserver.disconnect();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [transitionToMode]);

  const selectField = (mode: ModeId) => {
    setPreviewMode(null);
    resetRotationRef.current();
    if (mode === activeModeRef.current) return;
    transitionToMode(mode);
    window.dispatchEvent(
      new CustomEvent("research-field-select", {
        detail: { mode, source: "manual" },
      }),
    );
  };

  const visualMode = previewMode ?? activeMode;
  const areaForMode = (mode: ModeId) =>
    areas.find((area) => modeForArea(area) === mode) ?? areas[0]!;

  return (
    <div
      className="research-architecture"
      data-active-mode={activeMode}
      data-preview-mode={previewMode ?? undefined}
      data-reveal
      onPointerLeave={() => setPreviewMode(null)}
    >
      <div className="research-architecture-header">
        <span>Research architecture</span>
        <span>Evidence → Coordination → Inquiry</span>
      </div>

      <div className="research-flow" data-visual-mode={visualMode}>
        <svg
          className="research-flow-art"
          viewBox="0 0 1200 640"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            className="research-flow-spine"
            d="M 32 344 C 152 336 230 342 310 344 C 426 348 532 342 632 336 C 742 330 838 330 918 338 C 1024 348 1112 324 1190 300"
          />

          <g className="research-flow-stage research-flow-stage-rag">
            <g className="research-flow-evidence-lines">
              {evidencePaths.map((path) => (
                <path className="research-flow-line" d={path} key={path} />
              ))}
              {evidencePaths.slice(0, 5).map((path) => (
                <path
                  className="research-flow-line research-flow-animated-line"
                  d={path}
                  key={`active-${path}`}
                  pathLength="1"
                />
              ))}
            </g>

            <g className="research-flow-particles">
              {evidenceParticles.map(([cx, cy, radius]) => (
                <circle cx={cx} cy={cy} r={radius} key={`${cx}-${cy}`} />
              ))}
            </g>

            <g className="research-flow-core">
              <circle cx="310" cy="344" r="48" />
              <circle cx="310" cy="344" r="29" />
              <circle cx="310" cy="344" r="10" />
            </g>
          </g>

          <g className="research-flow-stage research-flow-stage-mas">
            <path
              className="research-flow-line"
              d="M 310 344 C 392 344 432 322 486 286"
            />
            <g className="research-flow-mesh">
              <path
                className="research-flow-line"
                d="M 486 286 L 550 232 L 628 264 L 704 218 L 764 292 L 724 378 L 642 416 L 556 380 Z M 486 286 L 632 336 L 550 232 M 628 264 L 632 336 L 704 218 M 764 292 L 632 336 L 724 378 M 642 416 L 632 336 L 556 380 M 550 232 L 704 218 M 764 292 L 642 416 M 486 286 L 556 380"
              />
              <path
                className="research-flow-line research-flow-animated-line"
                d="M 310 344 C 392 344 432 322 486 286 L 550 232 L 628 264 L 704 218 L 764 292 L 632 336 L 724 378 L 642 416 L 556 380 L 486 286"
                pathLength="1"
              />
              <path
                className="research-flow-field-line"
                d="M 456 334 C 514 184 710 154 796 288 C 850 374 760 476 636 470 C 508 464 426 400 456 334"
              />
              <path
                className="research-flow-field-line"
                d="M 492 332 C 536 224 682 202 754 294 C 800 354 730 430 638 430 C 546 430 466 390 492 332"
              />
              <g className="research-flow-network-nodes">
                {networkNodes.map(([cx, cy, radius]) => (
                  <circle cx={cx} cy={cy} r={radius} key={`${cx}-${cy}`} />
                ))}
              </g>
            </g>
          </g>

          <g className="research-flow-stage research-flow-stage-ai4s">
            <path
              className="research-flow-line"
              d="M 632 336 C 704 326 738 328 798 338"
            />
            <g className="research-flow-inquiry-field">
              {inquiryContours.map((path) => (
                <path
                  className="research-flow-contour"
                  d={path}
                  key={path}
                />
              ))}
              {inquiryBranches.map((path) => (
                <path className="research-flow-line" d={path} key={path} />
              ))}
              {inquiryBranches.map((path) => (
                <path
                  className="research-flow-line research-flow-animated-line"
                  d={path}
                  key={`active-${path}`}
                  pathLength="1"
                />
              ))}
              <g className="research-flow-inquiry-nodes">
                {inquiryNodes.map(([cx, cy, radius]) => (
                  <circle cx={cx} cy={cy} r={radius} key={`${cx}-${cy}`} />
                ))}
              </g>
            </g>
          </g>

          <path
            className="research-flow-feedback"
            d="M 1138 514 C 1000 608 714 620 464 592 C 322 576 224 546 152 502"
            pathLength="1"
          />
          <path
            className="research-flow-feedback research-flow-feedback-active"
            d="M 1138 514 C 1000 608 714 620 464 592 C 322 576 224 546 152 502"
            pathLength="1"
          />
        </svg>

        <div className="research-flow-copy-layer" aria-live="polite">
          {systemOrder.map((mode) => {
            const area = areaForMode(mode);
            const layer = systemLayers[mode];
            const isVisible = visualMode === mode;

            return (
              <article
                className={`research-flow-copy research-flow-copy-${mode.toLowerCase()}${
                  isVisible ? " is-visible" : ""
                }`}
                id={`research-flow-copy-${mode.toLowerCase()}`}
                aria-hidden={!isVisible}
                key={mode}
              >
                <div className="research-flow-copy-head">
                  <span>{layer.action}</span>
                  <span>{mode}</span>
                </div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <div className="research-flow-topics">
                  {area.questions.map((question) => (
                    <span key={question}>{question}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="research-flow-zones">
          {systemOrder.map((mode) => {
            const area = areaForMode(mode);
            const layer = systemLayers[mode];
            const isActive = activeMode === mode;
            const isVisible = visualMode === mode;

            return (
              <button
                className={`${isActive ? "is-active" : ""}${
                  isVisible ? " is-visible" : ""
                }`}
                type="button"
                aria-label={`Show ${area.title}`}
                aria-pressed={isActive}
                aria-controls={`research-flow-copy-${mode.toLowerCase()}`}
                data-research-mode={mode}
                key={mode}
                onClick={() => selectField(mode)}
                onPointerEnter={() => setPreviewMode(mode)}
                onFocus={() => setPreviewMode(mode)}
                onBlur={() => setPreviewMode(null)}
              >
                <span aria-hidden="true">{layer.action}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
