"use client";

import { useEffect, useRef, useState } from "react";

type TracePoint = {
  label: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  phase: number;
  kind: "term" | "evidence" | "marker";
};

const lenses = [
  {
    id: "MAS",
    title: "agent field",
    terms: [
      "COORDINATION",
      "SHARED MEMORY",
      "COLLECTIVE REASONING",
      "COMMUNICATION",
      "EVALUATION",
      "AGENT 01",
      "AGENT 02",
      "ENVIRONMENT",
    ],
  },
  {
    id: "AI4S",
    title: "discovery field",
    terms: [
      "QUESTION",
      "LITERATURE",
      "HYPOTHESIS",
      "EVIDENCE",
      "EXPERIMENT",
      "RESEARCH LOOP",
      "HUMAN IN LOOP",
      "DISCOVERY",
    ],
  },
  {
    id: "RAG",
    title: "retrieval field",
    terms: [
      "QUERY",
      "ENTITY",
      "CONTEXT",
      "RELEVANCE",
      "RETRIEVAL",
      "INDEX",
      "GENERATION",
      "GROUNDING",
    ],
  },
];

const positions = [
  [0.58, 0.22],
  [0.78, 0.16],
  [0.89, 0.34],
  [0.66, 0.43],
  [0.83, 0.54],
  [0.57, 0.65],
  [0.73, 0.76],
  [0.91, 0.7],
];

export function ResearchTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const [lensIndex, setLensIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const hero = canvas.closest<HTMLElement>(".hero");
    if (!hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lens = lenses[lensIndex];
    let width = 0;
    let height = 0;
    let startTime = performance.now();
    let points: TracePoint[] = [];

    const makePoints = () => {
      points = lens.terms.map((label, index) => ({
        label,
        x: positions[index][0] * width,
        y: positions[index][1] * height,
        offsetX: 0,
        offsetY: 0,
        phase: index * 1.73,
        kind:
          index % 4 === 0 ? "evidence" : index % 3 === 0 ? "marker" : "term",
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makePoints();
      if (reducedMotion) draw(performance.now());
    };

    const drawGrid = () => {
      context.save();
      context.strokeStyle = "rgba(11, 18, 24, 0.035)";
      context.lineWidth = 0.7;
      const spacing = width < 700 ? 38 : 52;
      for (let x = spacing; x < width; x += spacing) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = spacing; y < height; y += spacing) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const pointer = pointerRef.current;
      context.clearRect(0, 0, width, height);
      drawGrid();

      points.forEach((point, index) => {
        const baseX = point.x + Math.cos(elapsed * 0.22 + point.phase) * 4;
        const baseY = point.y + Math.sin(elapsed * 0.18 + point.phase) * 3;
        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active ? Math.max(0, 1 - distance / 175) : 0;
        const angle = Math.atan2(dy, dx);
        const targetOffsetX = Math.cos(angle) * influence * 13;
        const targetOffsetY = Math.sin(angle) * influence * 13;
        point.offsetX += (targetOffsetX - point.offsetX) * 0.075;
        point.offsetY += (targetOffsetY - point.offsetY) * 0.075;

        const x = baseX + point.offsetX;
        const y = baseY + point.offsetY;
        const opacity = 0.18 + influence * 0.57;

        if (influence > 0.04) {
          context.beginPath();
          context.strokeStyle = `rgba(45, 111, 146, ${influence * 0.23})`;
          context.lineWidth = 0.7;
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(x, y);
          context.stroke();
        }

        context.save();
        context.translate(x, y);
        context.strokeStyle = `rgba(45, 111, 146, ${opacity})`;
        context.fillStyle = `rgba(45, 111, 146, ${opacity})`;
        context.lineWidth = 0.8;

        if (point.kind === "evidence") {
          context.strokeRect(-5, -5, 10, 10);
          context.fillRect(-1, -1, 2, 2);
        } else if (point.kind === "marker") {
          context.beginPath();
          context.moveTo(-6, 0);
          context.lineTo(6, 0);
          context.moveTo(0, -6);
          context.lineTo(0, 6);
          context.stroke();
        } else {
          context.beginPath();
          context.arc(0, 0, influence > 0.1 ? 3.2 : 2.2, 0, Math.PI * 2);
          context.fill();
        }

        context.font = "500 8px var(--font-mono), monospace";
        context.letterSpacing = "0.08em";
        context.fillStyle = `rgba(24, 62, 82, ${0.2 + influence * 0.65})`;
        context.fillText(
          `${String(index + 1).padStart(2, "0")} / ${point.label}`,
          11,
          3,
        );
        context.restore();
      });

      if (pointer.active) {
        context.beginPath();
        context.strokeStyle = "rgba(45, 111, 146, 0.48)";
        context.lineWidth = 0.8;
        context.arc(pointer.x, pointer.y, 9, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.moveTo(pointer.x - 15, pointer.y);
        context.lineTo(pointer.x - 6, pointer.y);
        context.moveTo(pointer.x + 6, pointer.y);
        context.lineTo(pointer.x + 15, pointer.y);
        context.stroke();
      }

      if (!reducedMotion) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        pointerRef.current.active = false;
        return;
      }
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const onPointerLeave = (event: PointerEvent) => {
      const related = event.relatedTarget as Node | null;
      if (!related || !hero.contains(related)) {
        pointerRef.current.active = false;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    resize();
    startTime = performance.now();
    draw(startTime);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [lensIndex]);

  const lens = lenses[lensIndex];

  return (
    <div className="research-trace">
      <canvas ref={canvasRef} aria-hidden="true" />
      <button
        type="button"
        className="trace-control"
        onClick={() => setLensIndex((current) => (current + 1) % lenses.length)}
        aria-label={`Current generative research trace: ${lens.title}. Click to show the next research trace.`}
      >
        <span>{lens.id}</span>
        regenerate trace
      </button>
    </div>
  );
}
