"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import {
  defaultResearchThemeId,
  researchThemes,
  researchThemesById,
  type ResearchThemeId,
} from "../data/research";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const researchNarrative = [
  {
    id: "STATE",
    before: "My research on long-horizon LLM agents connects ",
    after: " from interaction traces, ",
  },
  {
    id: "MEMORY",
    before: "",
    after: " across sessions, and ",
  },
  {
    id: "LEARNING",
    before: "",
    after: " from recorded trajectories in scientific workflows.",
  },
] as const satisfies readonly {
  id: ResearchThemeId;
  before: string;
  after: string;
}[];

export function ResearchFieldSelector() {
  const [scrollId, setScrollId] = useState<ResearchThemeId>(
    defaultResearchThemeId,
  );
  const [hoveredId, setHoveredId] = useState<ResearchThemeId | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const focusedId = hoveredId ?? scrollId;

  useGSAP(
    () => {
      const region = regionRef.current;
      if (!region) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        let lastId: ResearchThemeId = defaultResearchThemeId;
        const trigger = ScrollTrigger.create({
          trigger: region,
          start: "top 72px",
          end: "bottom 28%",
          onUpdate: ({ progress }) => {
            const index = Math.min(
              researchThemes.length - 1,
              Math.floor(progress * researchThemes.length),
            );
            const nextId = researchThemes[index]?.id ?? defaultResearchThemeId;
            if (nextId === lastId) return;
            lastId = nextId;
            setScrollId(nextId);
          },
        });

        return () => trigger.kill();
      });

      return () => media.revert();
    },
    { scope: regionRef },
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const region = regionRef.current;
    if (!region) return;
    const rect = region.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    region.style.setProperty("--agenda-shift-x", `${x * 8}px`);
    region.style.setProperty("--agenda-shift-y", `${y * 6}px`);
  };

  const clearPointer = () => {
    regionRef.current?.style.setProperty("--agenda-shift-x", "0px");
    regionRef.current?.style.setProperty("--agenda-shift-y", "0px");
  };

  return (
    <div
      className="research-agenda"
      data-focus={focusedId ?? undefined}
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

      <div className="research-statement">
        <h2>Research</h2>
        <p>
          {researchNarrative.map(({ id, before, after }) => (
            <span key={id}>
              {before}
              <button
                className={id === focusedId ? "is-active" : undefined}
                type="button"
                aria-pressed={id === focusedId}
                onClick={() => setScrollId(id)}
                onFocus={() => setScrollId(id)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setHoveredId(id);
                }}
                onPointerLeave={() => setHoveredId(null)}
              >
                {researchThemesById[id].shortTitle.toLowerCase()}
              </button>
              {after}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
