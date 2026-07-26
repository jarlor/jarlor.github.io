"use client";

import { useEffect, useRef, useState } from "react";

type ModeId = "MAS" | "AI4S" | "RAG";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  orbit: number;
  band: number;
  energy: number;
};

type PointerState = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  active: boolean;
  pulse: number;
};

const modes: Array<{
  id: ModeId;
  label: string;
  instruction: string;
}> = [
  {
    id: "MAS",
    label: "Agent field",
    instruction: "Move to coordinate. Click to introduce new agents.",
  },
  {
    id: "AI4S",
    label: "Discovery loop",
    instruction: "Move to reshape inquiry. Click to seed a question.",
  },
  {
    id: "RAG",
    label: "Retrieval field",
    instruction: "Move the query. Click to retrieve new evidence.",
  },
];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function ResearchTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !context || !hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mode = modes[modeIndex].id;
    const pointer: PointerState = {
      x: 0,
      y: 0,
      previousX: 0,
      previousY: 0,
      active: false,
      pulse: 0,
    };

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let startTime = performance.now();
    let lastTime = startTime;
    let queryPulse = 0;
    let randomSeed = 97 + modeIndex * 131;

    const random = () => {
      randomSeed = (randomSeed * 16807) % 2147483647;
      return (randomSeed - 1) / 2147483646;
    };

    const makeParticle = (x?: number, y?: number): Particle => ({
      x: x ?? width * (0.27 + random() * 0.68),
      y: y ?? height * (0.12 + random() * 0.76),
      vx: (random() - 0.5) * 0.35,
      vy: (random() - 0.5) * 0.35,
      radius: 1.3 + random() * 2.4,
      phase: random() * Math.PI * 2,
      orbit: 0.12 + random() * 0.37,
      band: Math.floor(random() * 4),
      energy: 0,
    });

    const initialise = () => {
      randomSeed = 97 + modeIndex * 131;
      const count = width < 700 ? 24 : mode === "RAG" ? 46 : 34;
      particles = Array.from({ length: count }, () => makeParticle());

      if (mode === "AI4S") {
        const centerX = width * 0.69;
        const centerY = height * 0.46;
        particles.forEach((particle, index) => {
          const angle = (index / particles.length) * Math.PI * 2;
          const orbit = Math.min(width, height) * (0.16 + particle.band * 0.032);
          particle.x = centerX + Math.cos(angle) * orbit;
          particle.y = centerY + Math.sin(angle) * orbit * 0.62;
        });
      }
    };

    const drawSurface = () => {
      const wash = context.createRadialGradient(
        width * 0.7,
        height * 0.42,
        0,
        width * 0.7,
        height * 0.42,
        Math.max(width, height) * 0.58,
      );
      wash.addColorStop(0, "rgba(92, 164, 198, 0.105)");
      wash.addColorStop(0.46, "rgba(92, 164, 198, 0.028)");
      wash.addColorStop(1, "rgba(92, 164, 198, 0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.save();
      context.strokeStyle = "rgba(13, 34, 47, 0.026)";
      context.lineWidth = 0.7;
      const spacing = width < 700 ? 44 : 62;
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

    const drawPointer = () => {
      if (!pointer.active) return;
      const radius = 13 + pointer.pulse * 22;
      context.save();
      context.strokeStyle = `rgba(28, 105, 143, ${0.4 - pointer.pulse * 0.22})`;
      context.lineWidth = 0.8;
      context.beginPath();
      context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(pointer.x - 20, pointer.y);
      context.lineTo(pointer.x - 8, pointer.y);
      context.moveTo(pointer.x + 8, pointer.y);
      context.lineTo(pointer.x + 20, pointer.y);
      context.moveTo(pointer.x, pointer.y - 20);
      context.lineTo(pointer.x, pointer.y - 8);
      context.moveTo(pointer.x, pointer.y + 8);
      context.lineTo(pointer.x, pointer.y + 20);
      context.stroke();
      context.restore();
    };

    const drawNode = (
      particle: Particle,
      opacity: number,
      accent = false,
    ) => {
      context.save();
      context.translate(particle.x, particle.y);
      context.fillStyle = accent
        ? `rgba(22, 94, 132, ${opacity})`
        : `rgba(53, 116, 147, ${opacity})`;
      context.beginPath();
      context.arc(0, 0, particle.radius, 0, Math.PI * 2);
      context.fill();

      if (particle.energy > 0.18) {
        context.strokeStyle = `rgba(45, 120, 158, ${particle.energy * 0.28})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.arc(0, 0, 5 + particle.energy * 8, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
    };

    const updateMAS = (delta: number) => {
      const interactionRadius = width < 700 ? 82 : 118;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        let centerX = 0;
        let centerY = 0;
        let alignmentX = 0;
        let alignmentY = 0;
        let separationX = 0;
        let separationY = 0;
        let neighbours = 0;

        for (let j = 0; j < particles.length; j += 1) {
          if (i === j) continue;
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.hypot(dx, dy);
          if (distance < interactionRadius) {
            centerX += other.x;
            centerY += other.y;
            alignmentX += other.vx;
            alignmentY += other.vy;
            neighbours += 1;
            if (distance < 31 && distance > 0) {
              separationX -= dx / distance;
              separationY -= dy / distance;
            }
          }
        }

        if (neighbours > 0) {
          particle.vx +=
            ((centerX / neighbours - particle.x) * 0.00016 +
              (alignmentX / neighbours - particle.vx) * 0.009 +
              separationX * 0.016) *
            delta;
          particle.vy +=
            ((centerY / neighbours - particle.y) * 0.00016 +
              (alignmentY / neighbours - particle.vy) * 0.009 +
              separationY * 0.016) *
            delta;
        }

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.max(18, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - distance / 240);
          particle.vx += (dx / distance) * influence * 0.012 * delta;
          particle.vy += (dy / distance) * influence * 0.012 * delta;
          particle.energy = Math.max(particle.energy, influence);
        }

        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > 1.05) {
          particle.vx = (particle.vx / speed) * 1.05;
          particle.vy = (particle.vy / speed) * 1.05;
        }
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.energy *= 0.968;

        if (particle.x < width * 0.18 || particle.x > width - 24) {
          particle.vx *= -1;
          particle.x = clamp(particle.x, width * 0.18, width - 24);
        }
        if (particle.y < 90 || particle.y > height - 42) {
          particle.vy *= -1;
          particle.y = clamp(particle.y, 90, height - 42);
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const first = particles[i];
          const second = particles[j];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance < interactionRadius) {
            const opacity = (1 - distance / interactionRadius) * 0.16;
            context.strokeStyle = `rgba(37, 102, 136, ${opacity})`;
            context.lineWidth = 0.65;
            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.stroke();
          }
        }
      }

      particles.forEach((particle, index) =>
        drawNode(particle, 0.26 + particle.energy * 0.64, index % 7 === 0),
      );
    };

    const updateAI4S = (elapsed: number, delta: number) => {
      const pointerShiftX = pointer.active ? (pointer.x - width * 0.66) * 0.08 : 0;
      const pointerShiftY = pointer.active ? (pointer.y - height * 0.46) * 0.06 : 0;
      const centerX = width * 0.69 + pointerShiftX;
      const centerY = height * 0.46 + pointerShiftY;
      const baseOrbit = Math.min(width, height);

      context.save();
      context.strokeStyle = "rgba(38, 108, 143, 0.1)";
      context.lineWidth = 0.65;
      for (let band = 0; band < 4; band += 1) {
        const radius = baseOrbit * (0.145 + band * 0.038);
        context.beginPath();
        context.ellipse(centerX, centerY, radius, radius * 0.62, -0.16, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();

      particles.forEach((particle, index) => {
        const direction = particle.band % 2 === 0 ? 1 : -1;
        const angle =
          particle.phase + elapsed * (0.08 + particle.orbit * 0.15) * direction;
        const radius = baseOrbit * (0.145 + particle.band * 0.038);
        const targetX =
          centerX + Math.cos(angle) * radius + Math.sin(angle * 3) * 8;
        const targetY =
          centerY + Math.sin(angle) * radius * 0.62 + Math.cos(angle * 2) * 5;
        particle.x += (targetX - particle.x) * 0.025 * delta;
        particle.y += (targetY - particle.y) * 0.025 * delta;

        const next = particles[(index + 1) % particles.length];
        if (next.band === particle.band) {
          context.strokeStyle = `rgba(43, 111, 145, ${0.035 + particle.energy * 0.16})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }

        const pulseDistance = Math.abs(
          ((angle + Math.PI * 2) % (Math.PI * 2)) - queryPulse,
        );
        particle.energy = Math.max(
          particle.energy * 0.97,
          Math.max(0, 1 - pulseDistance * 2.4),
        );
        drawNode(particle, 0.24 + particle.energy * 0.7, index % 9 === 0);
      });

      queryPulse = (queryPulse + 0.006 * delta) % (Math.PI * 2);
    };

    const updateRAG = (elapsed: number, delta: number) => {
      const queryX = pointer.active ? pointer.x : width * 0.48;
      const queryY = pointer.active ? pointer.y : height * 0.48;
      const synthesisX = width * 0.82;
      const synthesisY = height * 0.48;
      const retrievalCycle = (elapsed * 0.34 + queryPulse) % 1;

      particles.forEach((particle, index) => {
        const driftX = Math.cos(elapsed * 0.12 + particle.phase) * 0.08;
        const driftY = Math.sin(elapsed * 0.15 + particle.phase) * 0.07;
        particle.x += (particle.vx * 0.18 + driftX) * delta;
        particle.y += (particle.vy * 0.18 + driftY) * delta;
        if (particle.x < width * 0.3 || particle.x > width - 30) particle.vx *= -1;
        if (particle.y < 100 || particle.y > height - 46) particle.vy *= -1;

        const distance = Math.hypot(particle.x - queryX, particle.y - queryY);
        const score =
          Math.max(0, 1 - distance / Math.max(width * 0.46, 320)) *
          (0.72 + ((index * 17) % 7) * 0.04);
        const selected = score > 0.56;
        particle.energy +=
          ((selected ? score : 0) - particle.energy) * 0.045 * delta;

        if (selected) {
          context.strokeStyle = `rgba(35, 105, 142, ${particle.energy * 0.18})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.moveTo(queryX, queryY);
          context.lineTo(particle.x, particle.y);
          context.stroke();

          const travel = (retrievalCycle + index * 0.117) % 1;
          const firstX = queryX + (particle.x - queryX) * Math.min(1, travel * 1.8);
          const firstY = queryY + (particle.y - queryY) * Math.min(1, travel * 1.8);
          const secondProgress = Math.max(0, (travel - 0.55) / 0.45);
          const streamX =
            secondProgress > 0
              ? particle.x + (synthesisX - particle.x) * secondProgress
              : firstX;
          const streamY =
            secondProgress > 0
              ? particle.y + (synthesisY - particle.y) * secondProgress
              : firstY;
          context.fillStyle = `rgba(27, 100, 139, ${0.45 + particle.energy * 0.45})`;
          context.beginPath();
          context.arc(streamX, streamY, 1.6, 0, Math.PI * 2);
          context.fill();
        }

        drawNode(particle, 0.12 + particle.energy * 0.72, selected);
      });

      context.save();
      context.strokeStyle = "rgba(30, 105, 144, 0.48)";
      context.lineWidth = 0.85;
      context.beginPath();
      context.arc(queryX, queryY, 9 + retrievalCycle * 16, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "rgba(24, 91, 128, 0.75)";
      context.beginPath();
      context.arc(synthesisX, synthesisY, 3.2, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(30, 105, 144, 0.17)";
      context.beginPath();
      context.arc(synthesisX, synthesisY, 16, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    };

    const draw = (now: number) => {
      const delta = clamp((now - lastTime) / 16.67, 0.25, 2.4);
      const elapsed = (now - startTime) / 1000;
      lastTime = now;
      context.clearRect(0, 0, width, height);
      drawSurface();

      if (mode === "MAS") updateMAS(delta);
      if (mode === "AI4S") updateAI4S(elapsed, delta);
      if (mode === "RAG") updateRAG(elapsed, delta);

      pointer.pulse *= 0.94;
      drawPointer();

      if (!reducedMotion) {
        frameRef.current = requestAnimationFrame(draw);
      }
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
      startTime = performance.now();
      lastTime = startTime;
      if (reducedMotion) draw(startTime);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
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
      if (reducedMotion) draw(performance.now());
    };

    const seedInteraction = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button")) return;
      updatePointer(event);
      pointer.pulse = 1;

      if (mode === "MAS") {
        const additions = Array.from({ length: 7 }, (_, index) => {
          const particle = makeParticle(pointer.x, pointer.y);
          const angle = (index / 7) * Math.PI * 2;
          particle.vx = Math.cos(angle) * (0.35 + random() * 0.55);
          particle.vy = Math.sin(angle) * (0.35 + random() * 0.55);
          particle.energy = 1;
          return particle;
        });
        particles.push(...additions);
        if (particles.length > 54) particles.splice(0, 7);
      }

      if (mode === "AI4S") {
        queryPulse = 0;
        particles.forEach((particle) => {
          particle.phase += (random() - 0.5) * 0.7;
          particle.energy = 1;
        });
      }

      if (mode === "RAG") {
        queryPulse = 1 - ((performance.now() - startTime) / 1000) * 0.34;
        particles.forEach((particle) => {
          particle.energy = 0;
        });
      }

      if (reducedMotion) draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", leavePointer);
    hero.addEventListener("pointerdown", seedInteraction);
    resize();
    draw(startTime);

    return () => {
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", leavePointer);
      hero.removeEventListener("pointerdown", seedInteraction);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [modeIndex]);

  const mode = modes[modeIndex];

  return (
    <div className="research-trace">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="trace-interface">
        <div className="trace-modes" role="tablist" aria-label="Canvas research mode">
          {modes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === modeIndex ? "is-active" : undefined}
              role="tab"
              aria-selected={index === modeIndex}
              onClick={() => setModeIndex(index)}
            >
              <span>{item.id}</span>
              {item.label}
            </button>
          ))}
        </div>
        <p>
          <span aria-hidden="true">↳</span>
          {mode.instruction}
        </p>
      </div>
    </div>
  );
}
