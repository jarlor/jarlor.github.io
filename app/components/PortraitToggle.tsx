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
      aria-label={`Show ${isPortrait ? "GitHub avatar" : "portrait photo"}`}
      title={`Show ${isPortrait ? "GitHub avatar" : "portrait photo"}`}
      onClick={() => setMode(isPortrait ? "github" : "portrait")}
    >
      <span className="hero-portrait-frame" aria-hidden="true">
        <Image
          className={`hero-portrait-primary ${isPortrait ? "is-visible" : ""}`}
          src="/jiale-zhang-photo.jpg"
          alt=""
          fill
          sizes="(max-width: 720px) 144px, 216px"
          priority
        />
        <Image
          className={`hero-github-avatar ${!isPortrait ? "is-visible" : ""}`}
          src="/jarlor-github-avatar.jpg"
          alt=""
          fill
          sizes="(max-width: 720px) 144px, 216px"
        />
      </span>
      <span className="hero-portrait-caption">
        <span>{isPortrait ? "Portrait" : "GitHub avatar"}</span>
        <strong>Switch ↻</strong>
      </span>
    </button>
  );
}
