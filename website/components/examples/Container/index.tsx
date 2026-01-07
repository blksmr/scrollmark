"use client";

import { useRef } from "react";
import { useDomet } from "domet";

const SECTIONS = [
  { id: "inbox", title: "Inbox", count: 12 },
  { id: "drafts", title: "Drafts", count: 3 },
  { id: "sent", title: "Sent", count: 45 },
  { id: "archive", title: "Archive", count: 128 },
  { id: "trash", title: "Trash", count: 7 },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Container() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { active, scroll, sections, register, link } = useDomet({
    ids: SECTION_IDS,
    container: containerRef,
  });

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <div className="mx-auto flex w-full max-w-4xl gap-6">
        <aside className="w-48 shrink-0 rounded border border-dashed border-gray-300 bg-white p-4">
          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">
            Mailbox
          </div>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map(({ id, title, count }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  {...link(id)}
                  className={`flex items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span>{title}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded bg-gray-50 p-3 text-xs">
            <div className="mb-2 text-gray-400">Scroll State</div>
            <div className="space-y-1 font-mono text-gray-600">
              <div>y: {Math.round(scroll.y)}</div>
              <div>progress: {Math.round(scroll.progress * 100)}%</div>
              <div>direction: {scroll.direction ?? "—"}</div>
              <div>scrolling: {scroll.scrolling ? "yes" : "no"}</div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col rounded border border-dashed border-gray-300 bg-white">
          <div className="border-b border-dashed border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {active ? `Viewing: ${active}` : "Select a folder"}
              </span>
              <span className="text-xs font-mono text-gray-400">
                {Math.round(scroll.progress * 100)}%
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-gray-400 transition-[width] duration-100"
                style={{ width: `${scroll.progress * 100}%` }}
              />
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {SECTIONS.map(({ id, title, count }) => {
              const sectionState = sections[id];

              return (
                <section
                  key={id}
                  {...register(id)}
                  className="mb-6 rounded border border-dashed border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    <span className="text-xs text-gray-400">{count} items</span>
                  </div>

                  <div className="space-y-2">
                    {[...Array(count > 10 ? 10 : count)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded bg-gray-50 p-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div
                            className="mb-1 h-3 rounded bg-gray-200"
                            style={{ width: `${40 + Math.random() * 40}%` }}
                          />
                          <div
                            className="h-2 rounded bg-gray-100"
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-4 text-xs text-gray-400">
                    <span>
                      visibility: {Math.round((sectionState?.visibility ?? 0) * 100)}%
                    </span>
                    <span>
                      progress: {Math.round((sectionState?.progress ?? 0) * 100)}%
                    </span>
                    <span>
                      inView: {sectionState?.inView ? "yes" : "no"}
                    </span>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
