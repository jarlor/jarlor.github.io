"use client";

import { useEffect, useRef } from "react";
import {
  defaultResearchThemeId,
  isResearchThemeId,
  RESEARCH_THEME_EVENT,
  type ResearchThemeEventDetail,
  type ResearchThemeId,
} from "../data/research";

type TraceNode = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  phase: number;
  size: number;
  group: number;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function ResearchTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const themeIdRef = useRef<ResearchThemeId>(defaultResearchThemeId);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !context || !hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const root = document.documentElement;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let nodes: TraceNode[] = [];
    let darkTheme = root.dataset.theme === "dark";
    let lastTime = performance.now();
    let seed = 1487;

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const setTargets = () => {
      nodes.forEach((node, index) => {
        const progress = index / Math.max(1, nodes.length - 1);
        if (themeIdRef.current === "STATE") {
          const lane = index % 4;
          node.tx = width * (0.44 + progress * 0.5);
          node.ty = height * (0.22 + lane * 0.16 + Math.sin(index * 1.8) * 0.028);
        }

        if (themeIdRef.current === "MEMORY") {
          const angle = progress * Math.PI * 2 + node.group * 0.34;
          const radius = Math.min(width, height) * (0.13 + node.group * 0.024);
          node.tx = width * 0.76 + Math.cos(angle) * radius;
          node.ty = height * 0.46 + Math.sin(angle) * radius * 0.68;
        }

        if (themeIdRef.current === "LEARNING") {
          const branch = index % 3;
          node.tx = width * (0.48 + progress * 0.48);
          node.ty = height * (0.46 + (branch - 1) * progress * 0.24);
        }
      });
    };

    const initialise = () => {
      seed = 1487;
      const count = width < 760 ? 26 : 46;
      nodes = Array.from({ length: count }, (_, index) => ({
        x: width * (0.42 + random() * 0.54),
        y: height * (0.14 + random() * 0.7),
        tx: 0,
        ty: 0,
        phase: random() * Math.PI * 2,
        size: 1 + random() * 1.8,
        group: index % 4,
      }));
      setTargets();
    };

    const draw = (now: number) => {
      const delta = clamp((now - lastTime) / 16.67, 0.45, 2.2);
      lastTime = now;
      const elapsed = now / 1000;
      context.clearRect(0, 0, width, height);

      const accent = darkTheme ? "134, 198, 201" : "39, 109, 115";
      const text = darkTheme ? "226, 235, 238" : "20, 42, 52";

      const wash = context.createRadialGradient(
        width * 0.76,
        height * 0.45,
        0,
        width * 0.76,
        height * 0.45,
        Math.max(width, height) * 0.48,
      );
      wash.addColorStop(0, `rgba(${accent}, ${darkTheme ? 0.11 : 0.08})`);
      wash.addColorStop(1, `rgba(${accent}, 0)`);
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      setTargets();
      nodes.forEach((node, index) => {
        const pointerInfluence = pointer.active
          ? Math.max(0, 1 - Math.hypot(pointer.x - node.x, pointer.y - node.y) / 280)
          : 0;
        const drift = reducedMotion ? 0 : Math.sin(elapsed * 0.42 + node.phase) * 3;
        node.x += (node.tx + drift - node.x) * 0.025 * delta;
        node.y += (node.ty + drift * 0.5 - node.y) * 0.025 * delta;

        if (pointerInfluence > 0) {
          node.x += (pointer.x - node.x) * pointerInfluence * 0.0025 * delta;
          node.y += (pointer.y - node.y) * pointerInfluence * 0.0025 * delta;
        }

        if (index > 0) {
          const previous = nodes[index - 1];
          if (previous) {
            const distance = Math.hypot(previous.x - node.x, previous.y - node.y);
            if (distance < width * 0.19) {
              context.strokeStyle = `rgba(${accent}, ${0.035 + pointerInfluence * 0.07})`;
              context.lineWidth = 0.7;
              context.beginPath();
              context.moveTo(previous.x, previous.y);
              context.lineTo(node.x, node.y);
              context.stroke();
            }
          }
        }

        context.fillStyle = `rgba(${index % 8 === 0 ? text : accent}, ${0.18 + pointerInfluence * 0.28})`;
        context.beginPath();
        context.arc(node.x, node.y, node.size + pointerInfluence * 1.1, 0, Math.PI * 2);
        context.fill();
      });

      if (themeIdRef.current === "LEARNING") {
        context.strokeStyle = `rgba(${accent}, 0.1)`;
        context.lineWidth = 0.8;
        context.setLineDash([4, 7]);
        context.beginPath();
        context.moveTo(width * 0.94, height * 0.7);
        context.bezierCurveTo(
          width * 0.83,
          height * 0.88,
          width * 0.54,
          height * 0.82,
          width * 0.48,
          height * 0.54,
        );
        context.stroke();
        context.setLineDash([]);
      }

      if (!reducedMotion) frameRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      initialise();
      if (reducedMotion) draw(performance.now());
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;
      if (reducedMotion) draw(performance.now());
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const handleThemeChange = (event: Event) => {
      const id = (event as CustomEvent<ResearchThemeEventDetail>).detail?.id;
      if (!isResearchThemeId(id)) return;

      themeIdRef.current = id;
      setTargets();
      if (reducedMotion) {
        nodes.forEach((node) => {
          node.x = node.tx;
          node.y = node.ty;
        });
        draw(performance.now());
      }
    };

    const themeObserver = new MutationObserver(() => {
      darkTheme = root.dataset.theme === "dark";
      if (reducedMotion) draw(performance.now());
    });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", clearPointer);
    window.addEventListener(RESEARCH_THEME_EVENT, handleThemeChange);

    resize();
    draw(lastTime);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener(RESEARCH_THEME_EVENT, handleThemeChange);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="research-trace" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
