import { useEffect, useRef, useState, useCallback } from "react";

type ScrollSpyOptions = {
  // Offset to adjust the "active zone" (e.g., center of viewport)
  rootMargin?: string;
  // More thresholds = finer detection
  threshold?: number | number[];
  // Lock duration in ms after programmatic scroll (click navigation)
  scrollLockMs?: number;
};

export function useScrollSpy(
  sectionIds: string[],
  { rootMargin = "0px 0px -50% 0px", threshold = [0, 0.25, 0.5, 0.75, 1], scrollLockMs = 800 }: ScrollSpyOptions = {}
) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Callback to attach refs to sections
  const registerRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) {
      refs.current[id] = el;
    } else {
      delete refs.current[id];
    }
  }, []);

  // Function to scroll to a section with lock (for click navigation)
  const scrollToSection = useCallback((id: string) => {
    // Lock the scroll spy to prevent intermediate activations
    isLockedRef.current = true;
    
    // Clear any existing lock timer
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
    }
    
    // Immediately set the target as active
    setActiveId(id);
    
    // Perform the scroll
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    
    // Unlock after scroll animation completes
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
    }, scrollLockMs);
  }, [scrollLockMs]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => refs.current[id])
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if scroll spy is locked (during programmatic navigation)
        if (isLockedRef.current) return;

        // Sort by visible ratio to find the most visible section
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const best = visibleEntries[0];
        const newActiveId = best.target.getAttribute("data-scrollspy-id");

        if (newActiveId) {
          setActiveId(newActiveId);
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, [sectionIds, rootMargin, threshold]);

  return { activeId, registerRef, scrollToSection };
}
