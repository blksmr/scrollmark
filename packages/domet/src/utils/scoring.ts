import type {
  InternalSectionBounds,
  SectionScore,
  ResolvedSection,
  CachedSectionPosition,
} from "../types";
import { MIN_SCROLL_THRESHOLD, EDGE_TOLERANCE } from "../constants";

export type ScoringContext = {
  scrollY: number;
  viewportHeight: number;
  scrollHeight: number;
  effectiveOffset: number;
  visibilityThreshold: number;
  scrollDirection: "up" | "down" | null;
  sectionIndexMap: Map<string, number>;
};

export function getSectionBounds(
  sections: ResolvedSection[],
  container: HTMLElement | null,
): InternalSectionBounds[] {
  const scrollTop = container ? container.scrollTop : window.scrollY;
  const containerTop = container ? container.getBoundingClientRect().top : 0;

  return sections.map(({ id, element }) => {
    const rect = element.getBoundingClientRect();
    const relativeTop = container
      ? rect.top - containerTop + scrollTop
      : rect.top + window.scrollY;
    return {
      id,
      top: relativeTop,
      bottom: relativeTop + rect.height,
      height: rect.height,
      rect,
    };
  });
}

export function buildSectionCache(
  sections: ResolvedSection[],
  container: HTMLElement | null,
): CachedSectionPosition[] {
  const scrollTop = container ? container.scrollTop : window.scrollY;
  const containerTop = container ? container.getBoundingClientRect().top : 0;

  return sections.map(({ id, element }) => {
    const rect = element.getBoundingClientRect();
    const baseTop = container
      ? rect.top - containerTop + scrollTop
      : rect.top + scrollTop;
    return {
      id,
      baseTop,
      height: rect.height,
      width: rect.width,
      left: rect.left,
    };
  });
}

export function getSectionBoundsFromCache(
  cache: CachedSectionPosition[],
  scrollY: number,
  viewportHeight: number,
): InternalSectionBounds[] {
  return cache.map((cached) => {
    const viewportTop = cached.baseTop - scrollY;
    const rect = {
      x: cached.left,
      y: viewportTop,
      width: cached.width,
      height: cached.height,
      top: viewportTop,
      bottom: viewportTop + cached.height,
      left: cached.left,
      right: cached.left + cached.width,
      toJSON() {
        return {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          top: this.top,
          bottom: this.bottom,
          left: this.left,
          right: this.right,
        };
      },
    } as DOMRect;

    return {
      id: cached.id,
      top: cached.baseTop,
      bottom: cached.baseTop + cached.height,
      height: cached.height,
      rect,
    };
  });
}

export function calculateSectionScores(
  sectionBounds: InternalSectionBounds[],
  _sections: ResolvedSection[],
  ctx: ScoringContext,
): SectionScore[] {
  const {
    scrollY,
    viewportHeight,
    effectiveOffset,
    visibilityThreshold,
    scrollDirection: _scrollDirection,
    sectionIndexMap: _sectionIndexMap,
  } = ctx;

  const viewportTop = scrollY;
  const viewportBottom = scrollY + viewportHeight;

  const maxScroll = Math.max(1, ctx.scrollHeight - viewportHeight);
  const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
  const dynamicOffset = effectiveOffset + scrollProgress * (viewportHeight - effectiveOffset);
  const triggerLine = scrollY + dynamicOffset;

  return sectionBounds.map((section) => {
    const visibleTop = Math.max(section.top, viewportTop);
    const visibleBottom = Math.min(section.bottom, viewportBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio =
      section.height > 0 ? visibleHeight / section.height : 0;
    const visibleInViewportRatio =
      viewportHeight > 0 ? visibleHeight / viewportHeight : 0;
    const isInView =
      section.bottom > viewportTop && section.top < viewportBottom;

    const sectionProgress = (() => {
      if (section.height === 0) return 0;
      const entryPoint = viewportBottom;
      const totalTravel = viewportHeight + section.height;
      const traveled = entryPoint - section.top;
      return Math.max(0, Math.min(1, traveled / totalTravel));
    })();

    let score = 0;

    if (visibilityRatio >= visibilityThreshold) {
      score += 1000 + visibilityRatio * 500;
    } else if (isInView) {
      score += visibleInViewportRatio * 800;
    }

    if (isInView) {
      const containsTriggerLine =
        triggerLine >= section.top && triggerLine < section.bottom;

      if (containsTriggerLine) {
        score += 300;
      }

      const sectionCenter = section.top + section.height / 2;
      const distanceFromTrigger = Math.abs(sectionCenter - triggerLine);
      const maxDistance = viewportHeight;
      const proximityScore =
        Math.max(0, 1 - distanceFromTrigger / maxDistance) * 500;
      score += proximityScore;
    }

    return {
      id: section.id,
      score,
      visibilityRatio,
      inView: isInView,
      bounds: section,
      progress: sectionProgress,
      rect: section.rect,
    };
  });
}

export function determineActiveSection(
  scores: SectionScore[],
  sectionIds: string[],
  currentActiveId: string | null,
  hysteresisMargin: number,
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
): string | null {
  if (scores.length === 0 || sectionIds.length === 0) return null;

  const scoreMap = new Map<string, SectionScore>();
  for (const s of scores) {
    scoreMap.set(s.id, s);
  }

  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  const hasScroll = maxScroll > MIN_SCROLL_THRESHOLD;
  const isAtBottom = hasScroll && scrollY + viewportHeight >= scrollHeight - EDGE_TOLERANCE;
  const isAtTop = hasScroll && scrollY <= EDGE_TOLERANCE;

  if (isAtBottom && sectionIds.length >= 2) {
    const lastId = sectionIds[sectionIds.length - 1];
    const secondLastId = sectionIds[sectionIds.length - 2];
    const secondLastScore = scoreMap.get(secondLastId);
    const secondLastNotVisible = !secondLastScore || !secondLastScore.inView;
    if (scoreMap.has(lastId) && secondLastNotVisible) {
      return lastId;
    }
  }

  if (isAtTop && sectionIds.length >= 2) {
    const firstId = sectionIds[0];
    const secondId = sectionIds[1];
    const secondScore = scoreMap.get(secondId);
    const secondNotVisible = !secondScore || !secondScore.inView;
    if (scoreMap.has(firstId) && secondNotVisible) {
      return firstId;
    }
  }

  let bestCandidate: SectionScore | null = null;
  let hasVisibleCandidate = false;

  for (const s of scores) {
    const isVisible = s.inView;
    if (hasVisibleCandidate && !isVisible) continue;
    if (!hasVisibleCandidate && isVisible) {
      hasVisibleCandidate = true;
      bestCandidate = s;
      continue;
    }
    if (!bestCandidate || s.score > bestCandidate.score) {
      bestCandidate = s;
    }
  }

  if (!bestCandidate) return null;

  const currentScore = scoreMap.get(currentActiveId ?? "");

  const shouldSwitch =
    !currentScore ||
    !currentScore.inView ||
    bestCandidate.score > currentScore.score + hysteresisMargin ||
    bestCandidate.id === currentActiveId;

  return shouldSwitch ? bestCandidate.id : currentActiveId;
}
