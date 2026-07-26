"use client";

import { useEffect } from "react";

const phrases = [
  "reason and coordinate across agents.",
  "turn AI into infrastructure for scientific discovery.",
  "retrieve, generate, and ground knowledge.",
];

export function PageMotion() {
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
      characterIndex += deleting ? -1 : 1;
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

  return null;
}
