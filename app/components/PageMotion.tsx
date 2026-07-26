"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const phrases = [
  "multi-agent systems.",
  "AI-enabled research paradigms.",
  "RAG and generative retrieval.",
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

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        ".research-intro h2",
        { opacity: 0.28, y: 38 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".research-intro",
            start: "top 82%",
            end: "top 38%",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        ".portrait img",
        { scale: 0.88, opacity: 0.42 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".profile-plate",
            start: "top bottom",
            end: "center center",
            scrub: 0.7,
          },
        },
      );
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
      gsap.set(".research-intro h2, .portrait img", {
        opacity: 1,
        y: 0,
        scale: 1,
      });
    });

    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: ({ progress }) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress}`,
      );
      },
    });

    return () => {
      progressTrigger.kill();
      media.revert();
    };
  });

  return null;
}
