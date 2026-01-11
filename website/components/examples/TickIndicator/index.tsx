"use client";

import { useDomet } from "domet";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";

const SECTIONS = [
  { id: "introduction", title: "Introduction", paragraphs: 3 },
  { id: "getting-started", title: "Getting Started", paragraphs: 5 },
  { id: "core-concepts", title: "Core Concepts", paragraphs: 4 },
  { id: "advanced-usage", title: "Advanced Usage", paragraphs: 8 },
  { id: "api-reference", title: "API Reference", paragraphs: 6 },
  { id: "examples", title: "Examples", paragraphs: 4 },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);
const TICK_SPACING = 10;
const HEADER_OFFSET = 96;

export function TickIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorHeight, setIndicatorHeight] = useState(0);

  const { active, scroll, sections, register, scrollTo } = useDomet({
    ids: SECTION_IDS,
  });

  useEffect(() => {
    const updateHeight = () => {
      if (indicatorRef.current) {
        setIndicatorHeight(indicatorRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const tickCount = useMemo(() => {
    if (indicatorHeight <= 0) return 0;
    return Math.floor(indicatorHeight / TICK_SPACING);
  }, [indicatorHeight]);

  const ticks = useMemo(() => {
    return Array.from({ length: tickCount }, (_, i) => i * TICK_SPACING);
  }, [tickCount]);

  const tickMaxPosition = useMemo(() => {
    if (tickCount <= 1) return 0;
    return (tickCount - 1) * TICK_SPACING;
  }, [tickCount]);

  const adjustedProgress = scroll.maxScroll > 0
    ? Math.min(1, scroll.progress + HEADER_OFFSET / scroll.maxScroll)
    : scroll.progress;
  const activeTickIndex = tickCount > 1
    ? Math.round(adjustedProgress * (tickCount - 1))
    : 0;
  const activePosition = activeTickIndex * TICK_SPACING;

  const sectionPositions = useMemo(() => {
    if (tickMaxPosition === 0 || scroll.maxScroll === 0) return [];
    const totalScrollableHeight = Math.max(1, scroll.maxScroll);
    const usableHeight = tickMaxPosition;

    return SECTIONS.map((section, index) => {
      const sectionState = sections[section.id];
      let position: number;

      if (sectionState?.bounds) {
        const absoluteTop = sectionState.bounds.top;
        position = (absoluteTop / totalScrollableHeight) * usableHeight;
      } else {
        position = (index / Math.max(1, SECTIONS.length - 1)) * usableHeight;
      }

      return {
        ...section,
        position: Math.max(0, Math.min(position, usableHeight)),
        indent: index % 2 === 0 ? 16 : 12,
      };
    });
  }, [tickMaxPosition, sections, scroll.maxScroll]);

  const sectionTicks = useMemo(() => {
    if (tickCount === 0) return [];

    return sectionPositions.map((section) => {
      const rawIndex = Math.round(section.position / TICK_SPACING);
      const tickIndex = Math.max(0, Math.min(rawIndex, tickCount - 1));

      return {
        ...section,
        tickIndex,
        position: tickIndex * TICK_SPACING,
      };
    });
  }, [sectionPositions, tickCount]);

  const sectionTickMap = useMemo(() => {
    const map = new Map<number, (typeof sectionTicks)[number]>();
    for (const section of sectionTicks) {
      if (!map.has(section.tickIndex)) {
        map.set(section.tickIndex, section);
      }
    }
    return map;
  }, [sectionTicks]);

  const handleTickClick = useCallback((tickIndex: number, sectionId?: string) => {
    if (sectionId) {
      scrollTo(sectionId, { position: "top", offset: HEADER_OFFSET });
      return;
    }

    if (tickCount <= 1 || scroll.maxScroll <= 0) return;

    const progress = tickIndex / (tickCount - 1);
    const targetScroll = progress * scroll.maxScroll;

    scrollTo({ top: targetScroll }, { lockActive: false, offset: HEADER_OFFSET });
  }, [scrollTo, tickCount, scroll.maxScroll]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="top-20 right-0 bottom-10 w-full max-w-[20vw] justify-end pl-10 lg:fixed hidden lg:flex">
        <div className="h-full max-lg:hidden" style={{ opacity: 1 }}>
          <div className="group relative z-50 h-full" ref={indicatorRef}>
            <div className="absolute inset-0">
              {ticks.map((position, index) => {
                const sectionAtTick = sectionTickMap.get(index);
                const isActiveSection = sectionAtTick?.id === active;
                const isPastTick = index < activeTickIndex;
                const tickColorClass = isActiveSection
                  ? "bg-blue-600"
                  : sectionAtTick
                    ? "bg-black"
                    : isPastTick
                      ? "bg-black/10"
                      : "bg-black/25";
                const tickHoverClass = isActiveSection
                  ? "group-hover/tick:bg-blue-600"
                  : "group-hover/tick:bg-black";
                const tickWidthClass = sectionAtTick ? "" : "w-2 group-hover/tick:w-4";

                return (
                  <div
                    key={position}
                    className="group/tick absolute right-4 grid w-24 items-center justify-end"
                    style={{ ["--position" as string]: `${position}px`, top: "var(--position)" }}
                  >
                    <div
                      className={`h-px transition-all duration-100 ${tickHoverClass} ${tickWidthClass} ${tickColorClass}`}
                      style={sectionAtTick ? { width: `${sectionAtTick.indent}px` } : undefined}
                    />
                    <div
                      className="absolute inset-x-0 h-2 cursor-pointer"
                      onClick={() => handleTickClick(index, sectionAtTick?.id)}
                    />
                  </div>
                );
              })}

              {sectionTicks.map((section, index) => (
                <div
                  key={section.id}
                  className="transition-transform duration-150 hover:-translate-x-0.5"
                >
                  <div
                    className="absolute right-[var(--indent)] flex h-[12px] items-center font-mono text-xs text-black uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-sm:opacity-100"
                    style={{
                      ["--yPosition" as string]: `${section.position - 6}px`,
                      ["--indent" as string]: `${section.indent + 20}px`,
                      top: "var(--yPosition)",
                      right: "var(--indent)",
                      zIndex: 10,
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo(section.id, { position: "top", offset: HEADER_OFFSET })}
                      className="cursor-pointer text-right hover:text-blue-600"
                    >
                      {section.title}
                    </button>
                  </div>
                </div>
              ))}

              <div
                className="absolute right-4 z-20 transition-opacity duration-300 opacity-100"
                style={{ top: activePosition }}
              >
                <div className="h-px w-4 bg-blue-600" />
                <span className="absolute top-0 -left-10 -translate-y-1/2 font-mono text-xs text-blue-600 transition-opacity duration-300 group-hover:opacity-0 max-sm:opacity-0">
                  {scroll.progress.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="fixed left-0 right-0 top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            Tick Indicator
          </div>
          <div className="text-xs font-mono text-gray-400">
            {Math.round(scroll.progress * 100)}%
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-24 lg:mr-[20vw]">
        {SECTIONS.map(({ id, title, paragraphs }) => {
          const sectionState = sections[id];
          const isActive = active === id;

          return (
            <section
              key={id}
              {...register(id)}
              className={`mb-16 rounded-lg border p-8 transition-colors ${
                isActive
                  ? "border-blue-200 bg-white shadow-sm"
                  : "border-gray-200 bg-white/50"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className={`text-xl font-semibold transition-colors ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {title}
                </h2>
                <div className="flex items-center gap-3">
                  {sectionState?.inView && (
                    <span className="text-xs text-green-600 font-medium">
                      In view
                    </span>
                  )}
                  <span className="text-xs font-mono text-gray-400">
                    {Math.round((sectionState?.progress ?? 0) * 100)}%
                  </span>
                </div>
              </div>

              {[...Array(paragraphs)].map((_, pIndex) => (
                <div key={pIndex} className="mb-6 space-y-3">
                  {[...Array(4 + (pIndex % 3))].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 rounded bg-gray-100"
                      style={{ width: `${60 + ((pIndex + i) * 7) % 40}%` }}
                    />
                  ))}
                </div>
              ))}

              <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">Visibility</div>
                    <div className="font-mono text-gray-700">
                      {Math.round((sectionState?.visibility ?? 0) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Progress</div>
                    <div className="font-mono text-gray-700">
                      {Math.round((sectionState?.progress ?? 0) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Active</div>
                    <div className={`font-mono ${sectionState?.active ? "text-blue-600" : "text-gray-400"}`}>
                      {sectionState?.active ? "yes" : "no"}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-4 left-4 z-20 rounded-lg bg-white border border-gray-200 shadow-lg p-4 lg:hidden">
        <div className="text-xs text-gray-500 mb-2">Scroll Progress</div>
        <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-[width] duration-100"
            style={{ width: `${scroll.progress * 100}%` }}
          />
        </div>
        <div className="text-xs font-mono text-gray-700 mt-1">
          {(scroll.progress * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
