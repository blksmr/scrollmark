import { useEffect, useRef, useState, useCallback } from "react";

type ScrollSpyOptions = {
  offset?: number;
  debounceMs?: number;
};

type SectionBounds = {
  id: string;
  top: number;
  bottom: number;
  height: number;
};

export function useScrollSpy(
  sectionIds: string[],
  { offset = 100, debounceMs = 10 }: ScrollSpyOptions = {}
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const lastScrollY = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerRef = (id: string) => (el: HTMLElement | null) => {
    if (el) {
      refs.current[id] = el;
    } else {
      delete refs.current[id];
    }
  };

  const getSectionBounds = useCallback((): SectionBounds[] => {
    return sectionIds
      .map((id) => {
        const el = refs.current[id];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY;
        return {
          id,
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY,
          height: rect.height,
        };
      })
      .filter((bounds): bounds is SectionBounds => bounds !== null);
  }, [sectionIds]);

  const calculateActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDirection = scrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = scrollY;

    const isAtBottom = scrollY + viewportHeight >= documentHeight - 5;
    if (isAtBottom && sectionIds.length > 0) {
      const lastId = sectionIds[sectionIds.length - 1];
      setActiveId((prev) => (prev !== lastId ? lastId : prev));
      return;
    }

    const isAtTop = scrollY <= 5;
    if (isAtTop && sectionIds.length > 0) {
      const firstId = sectionIds[0];
      setActiveId((prev) => (prev !== firstId ? firstId : prev));
      return;
    }

    const sections = getSectionBounds();
    if (sections.length === 0) return;

    const triggerLine = scrollY + offset;
    const viewportTop = scrollY;
    const viewportBottom = scrollY + viewportHeight;

    type SectionScore = {
      id: string;
      score: number;
      visibilityRatio: number;
      distanceFromTrigger: number;
      isInViewport: boolean;
    };

    const scores: SectionScore[] = sections.map((section) => {
      const visibleTop = Math.max(section.top, viewportTop);
      const visibleBottom = Math.min(section.bottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / section.height;

      const sectionCenter = section.top + section.height / 2;
      const distanceFromTrigger = Math.abs(triggerLine - sectionCenter);

      const isInViewport = section.bottom > viewportTop && section.top < viewportBottom;
      const triggerInSection = triggerLine >= section.top && triggerLine <= section.bottom;

      let score = 0;

      if (triggerInSection) {
        score += 1000;
        const positionInSection = (triggerLine - section.top) / section.height;
        score += (1 - Math.abs(positionInSection - 0.5)) * 100;
      }

      score += visibilityRatio * 200;

      const maxDistance = viewportHeight;
      const normalizedDistance = Math.min(distanceFromTrigger / maxDistance, 1);
      score += (1 - normalizedDistance) * 50;

      if (scrollDirection === "down" && section.top <= triggerLine) {
        score += 25;
      } else if (scrollDirection === "up" && section.bottom >= triggerLine) {
        score += 25;
      }

      return {
        id: section.id,
        score,
        visibilityRatio,
        distanceFromTrigger,
        isInViewport,
      };
    });

    const visibleScores = scores.filter((s) => s.isInViewport);
    const candidates = visibleScores.length > 0 ? visibleScores : scores;

    candidates.sort((a, b) => b.score - a.score);

    if (candidates.length > 0) {
      const bestId = candidates[0].id;
      setActiveId((prev) => (prev !== bestId ? bestId : prev));
    }
  }, [sectionIds, offset, getSectionBounds]);

  useEffect(() => {
    const handleScroll = () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
        rafId.current = requestAnimationFrame(calculateActiveSection);
      }, debounceMs);
    };

    calculateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [calculateActiveSection, debounceMs]);

  return { activeId, registerRef };
}
