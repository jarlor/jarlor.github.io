"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const phrases = {
  AI4S: "scientific inquiry.",
  MAS: "multi-agent collaboration.",
  RAG: "evidence-grounded generation.",
} as const;

export function PageMotion() {
  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-phrases]");
    if (!target) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let activeMode = "";
    let timer: ReturnType<typeof setTimeout>;
    let phraseTween: gsap.core.Timeline | null = null;
    let phraseVersion = 0;

    const typeCharacters = (phrase: string, version: number) => {
      clearTimeout(timer);
      let characterIndex = 0;
      target.textContent = "";
      const type = () => {
        if (version !== phraseVersion) return;
        characterIndex += 1;
        target.textContent = phrase.slice(0, characterIndex);
        if (characterIndex < phrase.length) {
          timer = setTimeout(type, 38);
        }
      };
      timer = setTimeout(type, 90);
    };

    const selectPhrase = (
      mode: keyof typeof phrases,
      options: { initial?: boolean } = {},
    ) => {
      if (!phrases[mode] || activeMode === mode) return;
      activeMode = mode;
      phraseVersion += 1;
      const version = phraseVersion;
      const phrase = phrases[mode];

      clearTimeout(timer);
      phraseTween?.kill();

      if (reducedMotion || options.initial) {
        target.textContent = phrase;
        gsap.set(target, { autoAlpha: 1, y: 0 });
        return;
      }

      phraseTween = gsap
        .timeline()
        .to(target, {
          autoAlpha: 0,
          y: -5,
          duration: 0.24,
          ease: "power2.in",
        })
        .call(() => typeCharacters(phrase, version))
        .set(target, { y: 6 })
        .to(target, {
          autoAlpha: 1,
          y: 0,
          duration: 0.46,
          ease: "power3.out",
        });
    };

    const handleResearchFieldChange = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: keyof typeof phrases }>).detail
        ?.mode;
      if (mode) selectPhrase(mode);
    };

    const initialMode =
      (document.documentElement.dataset
        .researchFocus as keyof typeof phrases) || "AI4S";
    selectPhrase(initialMode, { initial: true });
    window.addEventListener("research-field-change", handleResearchFieldChange);

    return () => {
      phraseVersion += 1;
      clearTimeout(timer);
      phraseTween?.kill();
      gsap.killTweensOf(target);
      window.removeEventListener(
        "research-field-change",
        handleResearchFieldChange,
      );
    };
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
        ".portrait",
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
      gsap.set(".research-intro h2, .portrait", {
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
    const initialRefresh = gsap.delayedCall(0.12, () => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    });

    return () => {
      initialRefresh.kill();
      progressTrigger.kill();
      media.revert();
    };
  });

  return null;
}
