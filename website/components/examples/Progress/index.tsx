"use client";

import { useDomet } from "domet";

const SECTIONS = [
  { id: "chapter-1", title: "Chapter 1" },
  { id: "chapter-2", title: "Chapter 2" },
  { id: "chapter-3", title: "Chapter 3" },
  { id: "chapter-4", title: "Chapter 4" },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Progress() {
  const { active, index, scroll, sections, register, link } = useDomet({
    ids: SECTION_IDS,
  });

  const globalProgress = scroll.progress * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 right-0 top-0 z-20 h-1 bg-gray-200">
        <div
          className="h-full bg-gray-800 transition-[width] duration-100"
          style={{ width: `${globalProgress}%` }}
        />
      </div>

      <header className="fixed left-0 right-0 top-1 z-10 border-b border-dashed border-gray-300 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="text-sm text-gray-500">
            {active ? `Reading: ${active}` : "Start reading"}
          </div>
          <div className="text-xs font-mono text-gray-400">
            {Math.round(globalProgress)}%
          </div>
        </div>

        <nav className="mx-auto flex max-w-3xl gap-1 px-6 pb-3">
          {SECTIONS.map(({ id, title }, i) => {
            const sectionProgress = sections[id]?.progress ?? 0;
            const isActive = active === id;
            const isPast = index > i;

            return (
              <button
                key={id}
                {...link(id)}
                className="group flex-1"
              >
                <div className="mb-1 h-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-[width] duration-100 ${
                      isPast ? "bg-gray-800" : isActive ? "bg-gray-600" : "bg-gray-300"
                    }`}
                    style={{ width: `${isPast ? 100 : sectionProgress * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {title}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        {SECTIONS.map(({ id, title }) => {
          const sectionState = sections[id];
          const progress = sectionState?.progress ?? 0;

          return (
            <section
              key={id}
              {...register(id)}
              className="mb-12 rounded border border-dashed border-gray-300 bg-white p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                <span className="text-xs font-mono text-gray-400">
                  {Math.round(progress * 100)}%
                </span>
              </div>

              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-gray-100"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 rounded bg-gray-50 p-4 text-xs">
                <div>
                  <div className="text-gray-400">Visibility</div>
                  <div className="font-mono text-gray-700">
                    {Math.round((sectionState?.visibility ?? 0) * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">In View</div>
                  <div className="font-mono text-gray-700">
                    {sectionState?.inView ? "yes" : "no"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Active</div>
                  <div className="font-mono text-gray-700">
                    {sectionState?.active ? "yes" : "no"}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
