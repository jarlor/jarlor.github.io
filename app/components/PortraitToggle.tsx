"use client";

import Image from "next/image";
import { useState } from "react";

type PortraitMode = "portrait" | "github";

export function PortraitToggle() {
  const [mode, setMode] = useState<PortraitMode>("portrait");
  const isPortrait = mode === "portrait";

  return (
    <button
      className="hero-portrait-toggle"
      type="button"
      aria-label={`Show ${isPortrait ? "GitHub avatar" : "formal portrait"}`}
      title={`Show ${isPortrait ? "GitHub avatar" : "formal portrait"}`}
      onClick={() => setMode(isPortrait ? "github" : "portrait")}
    >
      <span className="hero-portrait-frame" aria-hidden="true">
        <Image
          className={isPortrait ? "is-visible" : ""}
          src="/jiale-zhang.jpg"
          alt=""
          fill
          sizes="(max-width: 680px) 58vw, 220px"
          priority
          unoptimized
        />
        <Image
          className={!isPortrait ? "is-visible" : ""}
          src="/jarlor-github-avatar.jpg"
          alt=""
          fill
          sizes="(max-width: 680px) 58vw, 220px"
          priority
          unoptimized
        />
      </span>
      <span className="hero-portrait-caption" aria-live="polite">
        <span>{isPortrait ? "Portrait" : "GitHub avatar"}</span>
        <strong>Click to switch</strong>
      </span>
    </button>
  );
}
