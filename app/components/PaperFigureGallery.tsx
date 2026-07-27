"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PaperFigure } from "../data/publications";

export function PaperFigureGallery({
  figures,
}: {
  figures: PaperFigure[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeFigure = figures[activeIndex];

  const selectPrevious = () => {
    setActiveIndex((current) => (current - 1 + figures.length) % figures.length);
  };

  const selectNext = () => {
    setActiveIndex((current) => (current + 1) % figures.length);
  };

  return (
    <section
      className="paper-gallery"
      aria-label="Paper figures and tables"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectPrevious();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          selectNext();
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;

        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = endX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(distance) < 44) return;
        if (distance > 0) selectPrevious();
        else selectNext();
      }}
    >
      <div className="paper-gallery-heading">
        <span>Figures &amp; tables</span>
        <div className="paper-gallery-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")}
          <i>/</i>
          {String(figures.length).padStart(2, "0")}
        </div>
      </div>

      <div className="paper-gallery-stage">
        <Image
          key={activeFigure.src}
          src={activeFigure.src}
          alt={activeFigure.alt}
          width={activeFigure.width}
          height={activeFigure.height}
          sizes="(max-width: 720px) 100vw, 1200px"
          unoptimized
          priority={activeIndex === 0}
        />
      </div>

      <div className="paper-gallery-caption">
        <div>
          <span>{activeFigure.label}</span>
          <h3>{activeFigure.title}</h3>
        </div>
        <p>{activeFigure.caption}</p>
        <span className="paper-gallery-source">{activeFigure.source}</span>
      </div>

      <div className="paper-gallery-controls">
        <div className="paper-gallery-arrows">
          <button
            type="button"
            onClick={selectPrevious}
            aria-label="Show previous figure"
          >
            ←
          </button>
          <button
            type="button"
            onClick={selectNext}
            aria-label="Show next figure"
          >
            →
          </button>
        </div>

        <div
          className={`paper-gallery-rail paper-gallery-rail-${Math.min(
            figures.length,
            6,
          )}`}
          aria-label="Select a paper figure or table"
        >
          {figures.map((figure, index) => (
            <button
              className={index === activeIndex ? "is-active" : undefined}
              type="button"
              key={figure.src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${figure.title}`}
              aria-pressed={index === activeIndex}
            >
              <span className="paper-gallery-thumb">
                <Image
                  src={figure.src}
                  alt=""
                  width={figure.width}
                  height={figure.height}
                  sizes="120px"
                  unoptimized
                />
              </span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
