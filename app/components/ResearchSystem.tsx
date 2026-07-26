"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "agents" | "science" | "retrieval";

type GraphNode = {
  id: string;
  x: number;
  y: number;
  role: "core" | "agent" | "resource";
};

type GraphEdge = {
  from: number;
  to: number;
  direction?: "both";
};

const views: {
  id: Mode;
  index: string;
  short: string;
  title: string;
  status: string;
}[] = [
  {
    id: "agents",
    index: "01",
    short: "AGENTS",
    title: "Multi-agent coordination",
    status: "6 NODES / 8 CHANNELS",
  },
  {
    id: "science",
    index: "02",
    short: "SCIENCE",
    title: "AI-enabled research loop",
    status: "6 STAGES / HUMAN IN LOOP",
  },
  {
    id: "retrieval",
    index: "03",
    short: "RETRIEVAL",
    title: "Generative retrieval system",
    status: "6 MODULES / GROUNDED",
  },
];

const graphs: Record<Mode, { nodes: GraphNode[]; edges: GraphEdge[] }> = {
  agents: {
    nodes: [
      { id: "COORDINATOR", x: 0.5, y: 0.5, role: "core" },
      { id: "AGENT / PLAN", x: 0.2, y: 0.24, role: "agent" },
      { id: "AGENT / ACT", x: 0.8, y: 0.24, role: "agent" },
      { id: "AGENT / CRITIQUE", x: 0.82, y: 0.73, role: "agent" },
      { id: "SHARED MEMORY", x: 0.5, y: 0.86, role: "resource" },
      { id: "ENVIRONMENT", x: 0.17, y: 0.7, role: "resource" },
    ],
    edges: [
      { from: 0, to: 1, direction: "both" },
      { from: 0, to: 2, direction: "both" },
      { from: 0, to: 3, direction: "both" },
      { from: 0, to: 4, direction: "both" },
      { from: 0, to: 5, direction: "both" },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  },
  science: {
    nodes: [
      { id: "RESEARCH LOOP", x: 0.5, y: 0.5, role: "core" },
      { id: "QUESTION", x: 0.2, y: 0.22, role: "agent" },
      { id: "LITERATURE", x: 0.78, y: 0.2, role: "resource" },
      { id: "HYPOTHESIS", x: 0.84, y: 0.62, role: "agent" },
      { id: "EXPERIMENT", x: 0.52, y: 0.84, role: "agent" },
      { id: "EVIDENCE", x: 0.16, y: 0.67, role: "resource" },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 1 },
      { from: 0, to: 1 },
      { from: 0, to: 3 },
      { from: 0, to: 5 },
    ],
  },
  retrieval: {
    nodes: [
      { id: "GENERATOR", x: 0.5, y: 0.5, role: "core" },
      { id: "QUERY", x: 0.14, y: 0.3, role: "agent" },
      { id: "RETRIEVER", x: 0.42, y: 0.18, role: "agent" },
      { id: "INDEX / MEMORY", x: 0.81, y: 0.31, role: "resource" },
      { id: "EVIDENCE", x: 0.77, y: 0.75, role: "resource" },
      { id: "RESPONSE", x: 0.23, y: 0.76, role: "agent" },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3, direction: "both" },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 0, to: 5 },
      { from: 1, to: 0 },
      { from: 2, to: 0 },
      { from: 4, to: 5 },
    ],
  },
};

const phrases = [
  "reason and coordinate across agents.",
  "turn AI into infrastructure for scientific discovery.",
  "retrieve, generate, and ground knowledge.",
];

export function ResearchSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const [mode, setMode] = useState<Mode>("agents");

  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-phrases]");
    if (!target) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      target.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      const phrase = phrases[phraseIndex];
      if (deleting) {
        characterIndex -= 1;
      } else {
        characterIndex += 1;
      }

      target.textContent = phrase.slice(0, characterIndex);

      let delay = deleting ? 24 : 42;
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        delay = 2100;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 320;
      }

      timer = setTimeout(type, delay);
    };

    timer = setTimeout(type, 1700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const updateProgress = () => {
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? window.scrollY / available : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress}`,
      );
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const graph = graphs[mode];
    let width = 0;
    let height = 0;
    let timeOrigin = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) draw(performance.now());
    };

    const point = (node: GraphNode) => ({
      x: node.x * width,
      y: node.y * height,
    });

    const drawGrid = () => {
      context.save();
      context.strokeStyle = "rgba(176, 203, 219, 0.075)";
      context.lineWidth = 0.6;
      const spacing = 32;
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

    const drawArrow = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      alpha: number,
    ) => {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const endX = to.x - Math.cos(angle) * 19;
      const endY = to.y - Math.sin(angle) * 19;
      context.strokeStyle = `rgba(117, 185, 219, ${alpha})`;
      context.fillStyle = `rgba(117, 185, 219, ${alpha})`;
      context.lineWidth = 0.9;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(endX, endY);
      context.stroke();
      context.beginPath();
      context.moveTo(endX, endY);
      context.lineTo(
        endX - Math.cos(angle - 0.5) * 5,
        endY - Math.sin(angle - 0.5) * 5,
      );
      context.lineTo(
        endX - Math.cos(angle + 0.5) * 5,
        endY - Math.sin(angle + 0.5) * 5,
      );
      context.closePath();
      context.fill();
    };

    const draw = (now: number) => {
      const elapsed = (now - timeOrigin) / 1000;
      const pointer = pointerRef.current;
      context.clearRect(0, 0, width, height);
      drawGrid();

      const points = graph.nodes.map(point);
      const nearestIndex = pointer.active
        ? points.reduce(
            (best, current, index) => {
              const distance = Math.hypot(
                current.x - pointer.x,
                current.y - pointer.y,
              );
              return distance < best.distance ? { index, distance } : best;
            },
            { index: -1, distance: 90 },
          ).index
        : -1;

      graph.edges.forEach((edge, index) => {
        const from = points[edge.from];
        const to = points[edge.to];
        const emphasized =
          nearestIndex === edge.from || nearestIndex === edge.to;
        drawArrow(from, to, emphasized ? 0.84 : 0.32);
        if (edge.direction === "both") {
          drawArrow(to, from, emphasized ? 0.55 : 0.18);
        }

        const progress = (elapsed * (0.12 + (index % 3) * 0.025) + index / 8) % 1;
        const messageX = from.x + (to.x - from.x) * progress;
        const messageY = from.y + (to.y - from.y) * progress;
        context.beginPath();
        context.fillStyle = emphasized
          ? "rgba(183, 226, 246, 0.95)"
          : "rgba(117, 185, 219, 0.78)";
        context.arc(messageX, messageY, emphasized ? 2.8 : 2, 0, Math.PI * 2);
        context.fill();
      });

      graph.nodes.forEach((node, index) => {
        const { x, y } = points[index];
        const active = index === nearestIndex;
        const core = node.role === "core";
        const resource = node.role === "resource";
        const radius = core ? 33 : resource ? 22 : 18;

        if (active) {
          context.beginPath();
          context.strokeStyle = "rgba(183, 226, 246, 0.34)";
          context.lineWidth = 1;
          context.arc(x, y, radius + 12, 0, Math.PI * 2);
          context.stroke();
        }

        context.beginPath();
        context.fillStyle = core
          ? "#b7e2f6"
          : active
            ? "#dbeef6"
            : resource
              ? "#18384e"
              : "#102c41";
        context.strokeStyle = active
          ? "rgba(219, 238, 246, 0.95)"
          : "rgba(117, 185, 219, 0.7)";
        context.lineWidth = 1;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        if (core) {
          context.beginPath();
          context.strokeStyle = "rgba(7, 25, 39, 0.38)";
          context.arc(x, y, 22, 0, Math.PI * 2);
          context.stroke();
        }

        context.font = "500 8px var(--font-mono), monospace";
        context.letterSpacing = "0.08em";
        context.textAlign = "center";
        context.fillStyle = core
          ? "#071927"
          : active
            ? "#071927"
            : "rgba(219, 238, 246, 0.86)";
        context.fillText(String(index).padStart(2, "0"), x, y + 3);

        context.font = "400 8px var(--font-mono), monospace";
        context.fillStyle = active
          ? "rgba(219, 238, 246, 0.98)"
          : "rgba(176, 203, 219, 0.58)";
        context.fillText(node.id, x, y + radius + 17);
      });

      context.textAlign = "left";
      context.fillStyle = "rgba(176, 203, 219, 0.35)";
      context.font = "400 8px var(--font-mono), monospace";
      context.fillText(`SYSTEM VIEW / ${mode.toUpperCase()}`, 18, height - 18);

      if (!reducedMotion) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };
    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();
    timeOrigin = performance.now();
    draw(timeOrigin);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [mode]);

  const currentView = views.find((view) => view.id === mode) ?? views[0];

  return (
    <div className="system-figure">
      <div className="system-toolbar">
        <span>INTERACTIVE SYSTEM MAP</span>
        <span>MOVE TO TRACE CONNECTIONS</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label={`Interactive diagram: ${currentView.title}. Move the pointer to inspect connections.`}
      />
      <div className="system-caption">
        <span>{currentView.title}</span>
        <span>{currentView.status}</span>
      </div>
      <div className="view-switcher" role="group" aria-label="System map view">
        {views.map((view) => (
          <button
            type="button"
            key={view.id}
            className={mode === view.id ? "active" : ""}
            onClick={() => setMode(view.id)}
            aria-pressed={mode === view.id}
          >
            <span>{view.index}</span>
            {view.short}
          </button>
        ))}
      </div>
    </div>
  );
}
