"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import {
  defaultResearchThemeId,
  isResearchThemeId,
  RESEARCH_THEME_EVENT,
  researchThemeIds,
  researchThemesById,
  type ResearchThemeEventDetail,
  type ResearchThemeId,
} from "../data/research";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const typewriterMotion = {
  holdDurationMs: 6500,
  secondsPerCharacter: 0.027,
  minimumDuration: 0.72,
  maximumDuration: 1.5,
} as const;

export function PageMotion() {
  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-phrases]");
    const phraseWindow = target?.parentElement;
    if (!target || !phraseWindow) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let activeId: ResearchThemeId = defaultResearchThemeId;
    let phraseTimer: ReturnType<typeof setTimeout>;
    let transition: gsap.core.Timeline | null = null;

    const clearOutgoing = () => {
      phraseWindow
        .querySelectorAll(".hero-phrase-outgoing")
        .forEach((element) => element.remove());
    };

    const scheduleNextPhrase = () => {
      clearTimeout(phraseTimer);
      if (reducedMotion || document.hidden) return;
      phraseTimer = setTimeout(() => {
        const activeIndex = researchThemeIds.indexOf(activeId);
        const nextId =
          researchThemeIds[(activeIndex + 1) % researchThemeIds.length] ??
          defaultResearchThemeId;
        setPhrase(nextId, true);
      }, typewriterMotion.holdDurationMs);
    };

    const setPhrase = (id: ResearchThemeId, emit = false) => {
      if (id === activeId) {
        scheduleNextPhrase();
        return;
      }

      const previousText = target.textContent?.trim() ?? "";
      const nextText = researchThemesById[id].heroPhrase;
      activeId = id;
      clearTimeout(phraseTimer);
      transition?.kill();
      clearOutgoing();

      if (reducedMotion) {
        target.textContent = nextText;
        return;
      }

      const outgoing = document.createElement("span");
      outgoing.className = "hero-phrase-outgoing";
      outgoing.textContent = previousText;
      phraseWindow.append(outgoing);

      target.textContent = "";
      target.classList.add("is-typing");

      const typing = { characters: 0 };
      const typeDuration = gsap.utils.clamp(
        typewriterMotion.minimumDuration,
        typewriterMotion.maximumDuration,
        nextText.length * typewriterMotion.secondsPerCharacter,
      );
      transition = gsap.timeline({
        onComplete: () => {
          target.textContent = nextText;
          target.classList.remove("is-typing");
          clearOutgoing();
          scheduleNextPhrase();
        },
      });

      transition.to(
        outgoing,
        {
          x: () => Math.min(96, phraseWindow.clientWidth * 0.16),
          duration: 1.02,
          ease: "power3.inOut",
        },
        0,
      );
      transition.to(
        outgoing,
        {
          autoAlpha: 0,
          duration: 1.05,
          ease: "power1.inOut",
        },
        0,
      );
      transition.fromTo(
        target,
        { x: -10, autoAlpha: 0.72 },
        { x: 0, autoAlpha: 1, duration: 0.38, ease: "power2.out" },
        0.08,
      );
      transition.to(
        typing,
        {
          characters: nextText.length,
          duration: typeDuration,
          ease: "none",
          onUpdate: () => {
            target.textContent = nextText.slice(0, Math.round(typing.characters));
          },
        },
        0.08,
      );

      if (emit) {
        window.dispatchEvent(
          new CustomEvent<ResearchThemeEventDetail>(RESEARCH_THEME_EVENT, {
            detail: { id, source: "hero-cycle" },
          }),
        );
      }
    };

    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<ResearchThemeEventDetail>).detail;
      if (isResearchThemeId(detail?.id) && detail.source !== "hero-cycle") {
        setPhrase(detail.id);
      }
    };
    const handleVisibility = () => scheduleNextPhrase();

    window.addEventListener(RESEARCH_THEME_EVENT, handleThemeChange);
    document.addEventListener("visibilitychange", handleVisibility);
    scheduleNextPhrase();

    return () => {
      clearTimeout(phraseTimer);
      transition?.kill();
      clearOutgoing();
      target.classList.remove("is-typing");
      gsap.killTweensOf(target);
      window.removeEventListener(RESEARCH_THEME_EVENT, handleThemeChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        [
          ".hero-name-lockup",
          ".hero-research-title",
          ".hero-thesis",
          ".hero-actions",
        ],
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".hero-profile",
        { autoAlpha: 0, x: 28 },
        { autoAlpha: 1, x: 0, duration: 0.95, delay: 0.18, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        ".scroll-meter",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
          },
        },
      );
    });

    return () => media.revert();
  });

  return null;
}
