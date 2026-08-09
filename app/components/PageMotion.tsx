"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import {
  defaultResearchStageId,
  isResearchStageId,
  RESEARCH_STAGE_EVENT,
  researchStageIds,
  researchStagesById,
  type ResearchStageEventDetail,
  type ResearchStageId,
} from "../data/research";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const typewriterMotion = {
  holdDurationMs: 7600,
  secondsPerCharacter: 0.022,
  minimumDuration: 0.42,
  maximumDuration: 0.9,
} as const;

export function PageMotion() {
  useEffect(() => {
    const target = document.querySelector<HTMLElement>("[data-phrases]");
    const phraseWindow = target?.parentElement;
    if (!target || !phraseWindow) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let activeId: ResearchStageId = defaultResearchStageId;
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
        const activeIndex = researchStageIds.indexOf(activeId);
        const nextId =
          researchStageIds[(activeIndex + 1) % researchStageIds.length] ??
          defaultResearchStageId;
        setPhrase(nextId, true);
      }, typewriterMotion.holdDurationMs);
    };

    const setPhrase = (id: ResearchStageId, emit = false) => {
      if (id === activeId) {
        scheduleNextPhrase();
        return;
      }

      const previousText = target.textContent?.trim() ?? "";
      const nextText = researchStagesById[id].heroPhrase;
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
          x: () => Math.min(112, phraseWindow.clientWidth * 0.18),
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
        { x: -8, autoAlpha: 0.74 },
        { x: 0, autoAlpha: 1, duration: 0.32, ease: "power2.out" },
        0.05,
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
        0.05,
      );

      if (emit) {
        window.dispatchEvent(
          new CustomEvent<ResearchStageEventDetail>(RESEARCH_STAGE_EVENT, {
            detail: { id, source: "hero-cycle" },
          }),
        );
      }
    };

    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<ResearchStageEventDetail>).detail;
      if (isResearchStageId(detail?.id) && detail.source !== "hero-cycle") {
        setPhrase(detail.id);
      }
    };
    const handleVisibility = () => scheduleNextPhrase();

    window.addEventListener(RESEARCH_STAGE_EVENT, handleThemeChange);
    document.addEventListener("visibilitychange", handleVisibility);
    scheduleNextPhrase();

    return () => {
      clearTimeout(phraseTimer);
      transition?.kill();
      clearOutgoing();
      target.classList.remove("is-typing");
      gsap.killTweensOf(target);
      window.removeEventListener(RESEARCH_STAGE_EVENT, handleThemeChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-nav-target]"),
    );
    const setActiveNav = (sectionId: string | null) => {
      navLinks.forEach((link) => {
        const isActive = link.dataset.navTarget === sectionId;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        [
          ".hero-name-lockup",
          ".hero-research-title",
          ".hero-research-statement",
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

    ["research", "publications"].forEach((sectionId) => {
      ScrollTrigger.create({
        trigger: `#${sectionId}`,
        start: "top 42%",
        end: "bottom 42%",
        onEnter: () => setActiveNav(sectionId),
        onEnterBack: () => setActiveNav(sectionId),
      });
    });

    ScrollTrigger.create({
      trigger: "#top",
      start: "top top",
      end: "bottom 42%",
      onEnterBack: () => setActiveNav(null),
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "top 42%",
      onEnter: () => setActiveNav(null),
    });

    return () => {
      setActiveNav(null);
      media.revert();
    };
  });

  return null;
}
