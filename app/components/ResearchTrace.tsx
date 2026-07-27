"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

type ModeId = "MAS" | "AI4S" | "RAG";

type FieldNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  band: number;
  energy: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  life: number;
};

const modes: ModeId[] = ["AI4S", "RAG", "MAS"];
const modeDurations: Record<ModeId, number> = {
  AI4S: 6800,
  MAS: 5000,
  RAG: 4200,
};

const palettes: Record<
  ModeId,
  {
    blue: string;
    blueSoft: string;
    bluePale: string;
    rgb: [number, number, number];
  }
> = {
  MAS: {
    blue: "#2d6f92",
    blueSoft: "#75b9db",
    bluePale: "#b7e2f6",
    rgb: [45, 111, 146],
  },
  AI4S: {
    blue: "#287c78",
    blueSoft: "#79c9c0",
    bluePale: "#c7e9e3",
    rgb: [40, 124, 120],
  },
  RAG: {
    blue: "#4d669b",
    blueSoft: "#9eb5e2",
    bluePale: "#d8e1f5",
    rgb: [77, 102, 155],
  },
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function ResearchTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transitionCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const manualPauseRef = useRef(0);
  const autoRotationEnabledRef = useRef(true);
  const modeIndexRef = useRef(0);
  const hasTransitionedRef = useRef(false);
  const [modeIndex, setModeIndex] = useState(0);

  const captureCurrentField = useCallback(() => {
    const liveCanvas = canvasRef.current;
    const transitionCanvas = transitionCanvasRef.current;
    const transitionContext = transitionCanvas?.getContext("2d");
    if (!liveCanvas || !transitionCanvas || !transitionContext) return;

    transitionCanvas.width = liveCanvas.width;
    transitionCanvas.height = liveCanvas.height;
    transitionContext.setTransform(1, 0, 0, 1, 0, 0);
    transitionContext.clearRect(
      0,
      0,
      transitionCanvas.width,
      transitionCanvas.height,
    );
    transitionContext.drawImage(liveCanvas, 0, 0);
    gsap.killTweensOf(transitionCanvas);
    gsap.set(transitionCanvas, { opacity: 1 });
  }, []);

  const transitionToMode = useCallback(
    (nextIndex: number) => {
      if (nextIndex === modeIndexRef.current) return;
      captureCurrentField();
      modeIndexRef.current = nextIndex;
      setModeIndex(nextIndex);
    },
    [captureCurrentField],
  );

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const handleFieldSelect = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: ModeId }>).detail?.mode;
      if (!mode) return;
      const nextIndex = modes.indexOf(mode);
      if (nextIndex >= 0) {
        manualPauseRef.current = 1;
        root.dataset.researchInteraction = "manual";
        transitionToMode(nextIndex);
      }
    };

    let rotationTimer: number;
    const scheduleRotation = () => {
      if (reducedMotion) return;
      const currentMode = modes[modeIndexRef.current];
      rotationTimer = window.setTimeout(() => {
        if (!autoRotationEnabledRef.current) {
          scheduleRotation();
          return;
        }
        if (manualPauseRef.current > 0) {
          manualPauseRef.current -= 1;
          scheduleRotation();
          return;
        }
        root.dataset.researchInteraction = "auto";
        transitionToMode((modeIndexRef.current + 1) % modes.length);
        scheduleRotation();
      }, modeDurations[currentMode]);
    };

    root.dataset.researchInteraction = "auto";
    const visibleRegions = new Map<Element, boolean>();
    const rotationRegions = [
      document.querySelector(".hero"),
      document.querySelector("#research"),
    ].filter((region): region is Element => region !== null);
    const regionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRegions.set(entry.target, entry.isIntersecting);
        });
        autoRotationEnabledRef.current = Array.from(
          visibleRegions.values(),
        ).some(Boolean);
      },
      { threshold: 0.08 },
    );
    rotationRegions.forEach((region) => {
      visibleRegions.set(region, false);
      regionObserver.observe(region);
    });

    scheduleRotation();
    window.addEventListener("research-field-select", handleFieldSelect);
    return () => {
      window.clearTimeout(rotationTimer);
      regionObserver.disconnect();
      window.removeEventListener("research-field-select", handleFieldSelect);
    };
  }, [transitionToMode]);

  useEffect(() => {
    const mode = modes[modeIndex];
    const palette = palettes[mode];
    const root = document.documentElement;
    const relatedElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-research-mode]"),
    );

    root.dataset.researchFocus = mode;
    const paletteVars = {
      "--blue": palette.blue,
      "--blue-soft": palette.blueSoft,
      "--blue-pale": palette.bluePale,
      "--field-accent": palette.blue,
      "--field-accent-soft": palette.blueSoft,
      "--field-rgb": palette.rgb.join(" "),
    };

    if (!hasTransitionedRef.current) {
      gsap.set(root, paletteVars);
      hasTransitionedRef.current = true;
    } else {
      gsap.to(root, {
        ...paletteVars,
        duration: 1.05,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }

    relatedElements.forEach((element) => {
      element.classList.toggle(
        "is-canvas-related",
        element.dataset.researchMode === mode,
      );
    });
    window.dispatchEvent(
      new CustomEvent("research-field-change", { detail: { mode } }),
    );

    return () => {
      gsap.killTweensOf(root);
      relatedElements.forEach((element) =>
        element.classList.remove("is-canvas-related"),
      );
    };
  }, [modeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !context || !hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mode = modes[modeIndex];
    const palette = palettes[mode];
    const accentRgb = palette.rgb.join(", ");
    const accentDarkRgb = palette.rgb
      .map((channel) => Math.max(0, channel - 18))
      .join(", ");
    const accentLightRgb = palette.rgb
      .map((channel) => Math.min(255, channel + 24))
      .join(", ");
    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };
    const root = document.documentElement;

    let width = 0;
    let height = 0;
    let nodes: FieldNode[] = [];
    let ripples: Ripple[] = [];
    let darkTheme = root.dataset.theme === "dark";
    let seed = 131 + modeIndex * 179;
    let lastTime = performance.now();
    let startTime = lastTime;

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const makeNode = (): FieldNode => ({
      x: width * (0.32 + random() * 0.65),
      y: height * (0.13 + random() * 0.74),
      vx: (random() - 0.5) * 0.34,
      vy: (random() - 0.5) * 0.34,
      radius: 1.1 + random() * 2,
      phase: random() * Math.PI * 2,
      band: Math.floor(random() * 4),
      energy: 0,
    });

    const initialise = () => {
      seed = 131 + modeIndex * 179;
      const count = width < 700 ? 22 : mode === "RAG" ? 42 : 32;
      nodes = Array.from({ length: count }, makeNode);
      ripples = [
        {
          x: width * 0.7,
          y: height * 0.46,
          radius: 10,
          life: 0.58,
        },
      ];
      startTime = performance.now();
      lastTime = startTime;
    };

    const drawSurface = () => {
      const wash = context.createRadialGradient(
        width * 0.72,
        height * 0.44,
        0,
        width * 0.72,
        height * 0.44,
        Math.max(width, height) * 0.6,
      );
      wash.addColorStop(0, `rgba(${accentLightRgb}, 0.135)`);
      wash.addColorStop(0.5, `rgba(${accentLightRgb}, 0.035)`);
      wash.addColorStop(1, `rgba(${accentLightRgb}, 0)`);
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.save();
      context.strokeStyle = darkTheme
        ? "rgba(220, 233, 238, 0.035)"
        : "rgba(13, 34, 47, 0.025)";
      context.lineWidth = 0.65;
      const spacing = width < 700 ? 46 : 64;
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

    const drawNode = (node: FieldNode, opacity: number, accent = false) => {
      context.fillStyle = accent
        ? `rgba(${darkTheme ? accentLightRgb : accentDarkRgb}, ${opacity})`
        : `rgba(${accentRgb}, ${opacity})`;
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fill();

      if (node.energy > 0.34) {
        context.strokeStyle = `rgba(${accentLightRgb}, ${node.energy * 0.16})`;
        context.lineWidth = 0.65;
        context.beginPath();
        context.arc(node.x, node.y, 4 + node.energy * 7, 0, Math.PI * 2);
        context.stroke();
      }
    };

    const drawRipples = (delta: number) => {
      ripples.forEach((ripple) => {
        ripple.radius += 2.1 * delta;
        ripple.life -= 0.012 * delta;
        context.strokeStyle = `rgba(${accentRgb}, ${Math.max(0, ripple.life) * 0.22})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.stroke();
      });
      ripples = ripples.filter((ripple) => ripple.life > 0);
    };

    const influenceByPointer = (node: FieldNode, delta: number) => {
      if (!pointer.active) return;
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.max(24, Math.hypot(dx, dy));
      const influence = Math.max(0, 1 - distance / 300);
      node.vx += (dx / distance) * influence * 0.007 * delta;
      node.vy += (dy / distance) * influence * 0.007 * delta;
      node.energy = Math.max(node.energy, influence * 0.72);
    };

    const updateMAS = (delta: number) => {
      const relationRadius = width < 700 ? 92 : 128;

      nodes.forEach((node, index) => {
        let centerX = 0;
        let centerY = 0;
        let neighbours = 0;

        nodes.forEach((other, otherIndex) => {
          if (index === otherIndex) return;
          const distance = Math.hypot(other.x - node.x, other.y - node.y);
          if (distance < relationRadius) {
            centerX += other.x;
            centerY += other.y;
            neighbours += 1;
          }
        });

        if (neighbours > 0) {
          node.vx +=
            (centerX / neighbours - node.x) * 0.00012 * delta;
          node.vy +=
            (centerY / neighbours - node.y) * 0.00012 * delta;
        }
        influenceByPointer(node, delta);

        const speed = Math.hypot(node.vx, node.vy);
        if (speed > 0.9) {
          node.vx = (node.vx / speed) * 0.9;
          node.vy = (node.vy / speed) * 0.9;
        }
        node.x += node.vx * delta;
        node.y += node.vy * delta;
        node.energy *= 0.97;

        if (node.x < width * 0.25 || node.x > width - 22) node.vx *= -1;
        if (node.y < 88 || node.y > height - 54) node.vy *= -1;
        node.x = clamp(node.x, width * 0.25, width - 22);
        node.y = clamp(node.y, 88, height - 54);
      });

      nodes.forEach((first, index) => {
        nodes.slice(index + 1).forEach((second) => {
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance >= relationRadius) return;
          context.strokeStyle = `rgba(${darkTheme ? accentLightRgb : accentDarkRgb}, ${(1 - distance / relationRadius) * 0.14})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        });
      });

      nodes.forEach((node, index) =>
        drawNode(node, 0.24 + node.energy * 0.55, index % 7 === 0),
      );
    };

    const updateAI4S = (elapsed: number, delta: number) => {
      const pointerX = pointer.active ? (pointer.x - width * 0.71) * 0.04 : 0;
      const pointerY = pointer.active ? (pointer.y - height * 0.46) * 0.035 : 0;
      const centerX = width * 0.71 + pointerX;
      const centerY = height * 0.46 + pointerY;
      const base = Math.min(width, height);

      context.strokeStyle = `rgba(${accentRgb}, 0.09)`;
      context.lineWidth = 0.65;
      for (let band = 0; band < 4; band += 1) {
        const radius = base * (0.13 + band * 0.045);
        context.beginPath();
        context.ellipse(
          centerX,
          centerY,
          radius,
          radius * 0.61,
          -0.14,
          0,
          Math.PI * 2,
        );
        context.stroke();
      }

      nodes.forEach((node, index) => {
        const direction = node.band % 2 === 0 ? 1 : -1;
        const angle = node.phase + elapsed * (0.12 + node.band * 0.025) * direction;
        const radius = base * (0.13 + node.band * 0.045);
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius * 0.61;
        node.x += (targetX - node.x) * 0.035 * delta;
        node.y += (targetY - node.y) * 0.035 * delta;

        const phase = (elapsed * 0.42 + index / nodes.length) % 1;
        node.energy = Math.max(node.energy * 0.97, phase > 0.9 ? 1 - phase : 0);
        drawNode(node, 0.22 + node.energy * 0.58, index % 8 === 0);
      });
    };

    const updateRAG = (elapsed: number, delta: number) => {
      const anchorX =
        width * 0.56 + (pointer.active ? (pointer.x - width * 0.56) * 0.16 : 0);
      const anchorY =
        height * 0.47 + (pointer.active ? (pointer.y - height * 0.47) * 0.13 : 0);
      const synthesisX = width * 0.84;
      const synthesisY = height * 0.47;

      nodes.forEach((node, index) => {
        node.x += (node.vx * 0.2 + Math.cos(elapsed + node.phase) * 0.04) * delta;
        node.y += (node.vy * 0.2 + Math.sin(elapsed + node.phase) * 0.04) * delta;
        if (node.x < width * 0.34 || node.x > width - 24) node.vx *= -1;
        if (node.y < 96 || node.y > height - 54) node.vy *= -1;

        const distance = Math.hypot(node.x - anchorX, node.y - anchorY);
        const score = Math.max(0, 1 - distance / Math.max(width * 0.42, 300));
        const selected = score > 0.55;
        node.energy += ((selected ? score : 0) - node.energy) * 0.04 * delta;

        if (selected) {
          context.strokeStyle = `rgba(${darkTheme ? accentLightRgb : accentDarkRgb}, ${node.energy * 0.16})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(anchorX, anchorY);
          context.lineTo(node.x, node.y);
          context.lineTo(synthesisX, synthesisY);
          context.stroke();

          const travel = (elapsed * 0.18 + index * 0.13) % 1;
          const streamX =
            travel < 0.5
              ? anchorX + (node.x - anchorX) * travel * 2
              : node.x + (synthesisX - node.x) * (travel - 0.5) * 2;
          const streamY =
            travel < 0.5
              ? anchorY + (node.y - anchorY) * travel * 2
              : node.y + (synthesisY - node.y) * (travel - 0.5) * 2;
          context.fillStyle = `rgba(${darkTheme ? accentLightRgb : accentDarkRgb}, 0.52)`;
          context.beginPath();
          context.arc(streamX, streamY, 1.4, 0, Math.PI * 2);
          context.fill();
        }

        drawNode(node, 0.12 + node.energy * 0.62, selected);
      });

      context.fillStyle = `rgba(${darkTheme ? accentLightRgb : accentDarkRgb}, 0.6)`;
      context.beginPath();
      context.arc(synthesisX, synthesisY, 2.5, 0, Math.PI * 2);
      context.fill();
    };

    const draw = (now: number) => {
      const delta = clamp((now - lastTime) / 16.67, 0.3, 2.2);
      const elapsed = (now - startTime) / 1000;
      lastTime = now;
      context.clearRect(0, 0, width, height);
      drawSurface();

      if (mode === "MAS") updateMAS(delta);
      if (mode === "AI4S") updateAI4S(elapsed, delta);
      if (mode === "RAG") updateRAG(elapsed, delta);
      drawRipples(delta);

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

    const leavePointer = () => {
      pointer.active = false;
    };

    const themeObserver = new MutationObserver(() => {
      darkTheme = root.dataset.theme === "dark";
      if (reducedMotion) draw(performance.now());
    });

    const pulseField = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button")) return;
      updatePointer(event);
      ripples.push({
        x: pointer.x,
        y: pointer.y,
        radius: 8,
        life: 0.8,
      });
      nodes.forEach((node) => {
        const distance = Math.max(
          30,
          Math.hypot(node.x - pointer.x, node.y - pointer.y),
        );
        if (distance > 260) return;
        const force = (1 - distance / 260) * 0.52;
        node.vx += ((node.x - pointer.x) / distance) * force;
        node.vy += ((node.y - pointer.y) / distance) * force;
        node.energy = Math.max(node.energy, force);
      });
      if (reducedMotion) draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", leavePointer);
    hero.addEventListener("pointerdown", pulseField);
    resize();
    draw(startTime);

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", leavePointer);
      hero.removeEventListener("pointerdown", pulseField);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [modeIndex]);

  useEffect(() => {
    const liveCanvas = canvasRef.current;
    const transitionCanvas = transitionCanvasRef.current;
    if (!liveCanvas || !transitionCanvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf([liveCanvas, transitionCanvas]);
    if (reducedMotion || !transitionCanvas.width) {
      gsap.set(liveCanvas, { opacity: 1 });
      gsap.set(transitionCanvas, { opacity: 0 });
      return;
    }

    gsap.fromTo(
      liveCanvas,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.05,
        ease: "power3.inOut",
        overwrite: true,
      },
    );
    gsap.to(transitionCanvas, {
      opacity: 0,
      duration: 1.05,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [modeIndex]);

  return (
    <div className="research-trace">
      <canvas
        className="trace-live-canvas"
        ref={canvasRef}
        aria-hidden="true"
      />
      <canvas
        className="trace-transition-canvas"
        ref={transitionCanvasRef}
        aria-hidden="true"
      />
    </div>
  );
}
