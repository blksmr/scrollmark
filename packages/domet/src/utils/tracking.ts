import type { ScrollState, SectionState } from "../types";

export type ObservedScrollKeys = Set<keyof ScrollState>;
export type ObservedSectionKeys = Map<string, Set<keyof SectionState | "bounds.top" | "bounds.bottom" | "bounds.height">>;

export function createScrollProxy(
  state: ScrollState,
  observedKeys: ObservedScrollKeys,
): ScrollState {
  return new Proxy(state, {
    get(target, prop: string) {
      if (prop in target) {
        observedKeys.add(prop as keyof ScrollState);
      }
      return target[prop as keyof ScrollState];
    },
  });
}

export function createSectionsProxy(
  sections: Record<string, SectionState>,
  observedKeys: ObservedSectionKeys,
): Record<string, SectionState> {
  return new Proxy(sections, {
    get(target, sectionId: string) {
      const section = target[sectionId];
      if (!section) return undefined;

      if (!observedKeys.has(sectionId)) {
        observedKeys.set(sectionId, new Set());
      }
      const sectionObserved = observedKeys.get(sectionId)!;

      return new Proxy(section, {
        get(sTarget, prop: string) {
          if (prop === "bounds") {
            return new Proxy(sTarget.bounds, {
              get(bTarget, bProp: string) {
                sectionObserved.add(`bounds.${bProp}` as "bounds.top" | "bounds.bottom" | "bounds.height");
                return bTarget[bProp as keyof typeof bTarget];
              },
            });
          }
          if (prop in sTarget) {
            sectionObserved.add(prop as keyof SectionState);
          }
          return sTarget[prop as keyof SectionState];
        },
      });
    },
    ownKeys(target) {
      return Object.keys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      return Object.getOwnPropertyDescriptor(target, prop);
    },
  });
}

export function hasObservedScrollChanged(
  prev: ScrollState,
  next: ScrollState,
  observedKeys: ObservedScrollKeys,
): boolean {
  if (observedKeys.size === 0) return false;

  for (const key of observedKeys) {
    if (prev[key] !== next[key]) {
      return true;
    }
  }
  return false;
}

export function hasObservedSectionsChanged(
  prev: Record<string, SectionState> | null,
  next: Record<string, SectionState>,
  observedKeys: ObservedSectionKeys,
): boolean {
  if (!prev) return observedKeys.size > 0;
  if (observedKeys.size === 0) return false;

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return true;

  for (const [sectionId, keys] of observedKeys) {
    const prevSection = prev[sectionId];
    const nextSection = next[sectionId];

    if (!prevSection || !nextSection) return true;

    for (const key of keys) {
      if (key === "bounds.top") {
        if (prevSection.bounds.top !== nextSection.bounds.top) return true;
      } else if (key === "bounds.bottom") {
        if (prevSection.bounds.bottom !== nextSection.bounds.bottom) return true;
      } else if (key === "bounds.height") {
        if (prevSection.bounds.height !== nextSection.bounds.height) return true;
      } else if (key === "bounds") {
        if (
          prevSection.bounds.top !== nextSection.bounds.top ||
          prevSection.bounds.bottom !== nextSection.bounds.bottom ||
          prevSection.bounds.height !== nextSection.bounds.height
        ) return true;
      } else if (key === "rect") {
        continue;
      } else {
        const k = key as keyof Omit<SectionState, "bounds" | "rect">;
        if (prevSection[k] !== nextSection[k]) return true;
      }
    }
  }
  return false;
}
