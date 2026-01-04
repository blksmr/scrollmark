"use client";

import { useScrowl } from "scrowl";

const SECTION_IDS = ["intro", "features", "usage", "api"] as const;

export function Basic() {
  const { activeId, registerRef, scrollToSection } = useScrowl([...SECTION_IDS], null, {
    offset: 0,
  });

  return (
    <div className="flex min-h-screen">
      <nav className="w-40 shrink-0 border-r border-neutral-100 p-4 sticky top-0 h-screen">
        <ul className="space-y-1">
          {SECTION_IDS.map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeId === id
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-6 space-y-12">
        <section id="intro" ref={registerRef("intro")} className="min-h-[300px]">
          <h2 className="text-xl font-bold mb-3">Introduction</h2>
          <p className="text-neutral-600 text-sm">
            Scrowl is a lightweight React hook for scroll-spy functionality.
            It automatically tracks which section is currently in view and
            provides smooth scrolling navigation.
          </p>
        </section>

        <section id="features" ref={registerRef("features")} className="min-h-[300px]">
          <h2 className="text-xl font-bold mb-3">Features</h2>
          <ul className="list-disc list-inside text-neutral-600 text-sm space-y-1">
            <li>Automatic header detection</li>
            <li>Hysteresis to prevent flickering</li>
            <li>Smooth scroll navigation</li>
            <li>Container scroll support</li>
            <li>Debug overlay included</li>
          </ul>
        </section>

        <section id="usage" ref={registerRef("usage")} className="min-h-[300px]">
          <h2 className="text-xl font-bold mb-3">Usage</h2>
          <p className="text-neutral-600 text-sm">
            Import the hook, define your section IDs, and use registerRef to
            connect your sections. The activeId tells you which section is
            currently visible.
          </p>
        </section>

        <section id="api" ref={registerRef("api")} className="min-h-[300px]">
          <h2 className="text-xl font-bold mb-3">API Reference</h2>
          <p className="text-neutral-600 text-sm">
            The hook returns activeId, registerRef, and scrollToSection.
            Configure with offset, offsetRatio, and debounceMs options.
          </p>
        </section>
      </main>
    </div>
  );
}
