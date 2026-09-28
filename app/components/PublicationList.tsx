"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PublicationWork } from "../data/publications";
import { siteProfile } from "../data/site";
import { PaperFigureGallery } from "./PaperFigureGallery";

function Authors({ names }: { names: string }) {
  const authorIndex = names.indexOf(siteProfile.name);

  if (authorIndex === -1) return names;

  const before = names.slice(0, authorIndex);
  const after = names.slice(authorIndex + siteProfile.name.length);

  return (
    <>
      {before}
      <strong className="self-author">{siteProfile.name}</strong>
      {after}
    </>
  );
}

export function PublicationList({
  works,
}: {
  works: PublicationWork[];
}) {
  const [selectedWork, setSelectedWork] = useState<PublicationWork | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedWork) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedWork(null);
      if (event.key !== "Tab") return;

      const controls = viewerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => returnFocus.current?.focus());
    };
  }, [selectedWork]);

  const openWork = (work: PublicationWork) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setSelectedWork(work);
  };

  return (
    <>
      <div className="publication-list">
        {works.map((work) => (
          <article className="publication-entry" key={work.title}>
            <button
              className="publication-row-hit"
              type="button"
              onClick={() => openWork(work)}
              aria-label={`View details for ${work.title}`}
            />
            <div className="publication-row">
              <span className="publication-thumbnail-frame">
                <Image
                  src={work.preview.src}
                  alt={work.preview.alt}
                  fill
                  sizes="(max-width: 720px) 112px, 216px"
                />
              </span>
              <div className="publication-main">
                <h3 className="publication-title">
                  {work.title}
                </h3>
                <p className="publication-authors">
                  <Authors names={work.authors} />
                </p>
                <p className="publication-venue">
                  {work.venue}{work.status === "Preprint" ? " preprint" : ""} · {work.year}
                </p>
                <div className="publication-resource-links">
                  {work.resources.map((resource) => (
                    <a
                      key={resource.label}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {resource.label}
                    </a>
                  ))}
                  <button
                    className="publication-open"
                    type="button"
                    onClick={() => openWork(work)}
                    aria-label={`Details: ${work.title}`}
                  >
                    Details <i aria-hidden="true">↗</i>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedWork ? (
        <div
          className="paper-viewer-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedWork(null);
          }}
        >
          <article
            className="paper-viewer"
            ref={viewerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="paper-viewer-title"
          >
            <header className="paper-viewer-header">
              <div>
                <span>{selectedWork.year}</span>
                <span>{selectedWork.status}</span>
                <span>{selectedWork.venue}</span>
              </div>
              <button
                className="paper-viewer-close"
                type="button"
                onClick={() => setSelectedWork(null)}
                aria-label="Close paper viewer"
                autoFocus
              >
                ×
              </button>
            </header>

            <div className="paper-viewer-title">
              <span>{selectedWork.area}</span>
              <h2 id="paper-viewer-title">{selectedWork.title}</h2>
              <p>
                <Authors names={selectedWork.authors} />
              </p>
            </div>

            <div className="paper-viewer-layout">
              <aside className="paper-viewer-copy">
                <section>
                  <span>In One Sentence</span>
                  <p className="paper-viewer-deck">{selectedWork.summary}</p>
                </section>
                <section>
                  <span>Abstract</span>
                  <p>{selectedWork.abstract}</p>
                </section>
                <div className="paper-viewer-links">
                  {selectedWork.resources.map((resource) => (
                    <a
                      key={resource.label}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {resource.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </aside>

              <PaperFigureGallery figures={selectedWork.figures} />
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
