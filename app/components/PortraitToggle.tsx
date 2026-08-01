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
          className={`hero-portrait-primary ${isPortrait ? "is-visible" : ""}`}
          src="/jiale-zhang-dark.jpg"
          alt=""
          fill
          sizes="(max-width: 720px) 54vw, (max-width: 960px) 232px, 248px"
          priority
        />
        <Image
          className={`hero-github-avatar ${!isPortrait ? "is-visible" : ""}`}
          src="/jarlor-github-avatar.jpg"
          alt=""
          fill
          sizes="(max-width: 720px) 54vw, (max-width: 960px) 232px, 248px"
        />
      </span>
      <span className="hero-portrait-caption">
        <span>{isPortrait ? "Portrait" : "GitHub avatar"}</span>
        <strong>Switch ↻</strong>
      </span>
    </button>
  );
}
