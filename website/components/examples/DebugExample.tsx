"use client";

import { useState } from "react";
import { useScrowl, ScrowlDebugOverlay } from "scrowl";

const SECTION_IDS = ["hero", "about", "services", "contact"] as const;

export function DebugExample() {
  const [debugEnabled, setDebugEnabled] = useState(true);
  const { activeId, registerRef, scrollToSection, debugInfo } = useScrowl(
    [...SECTION_IDS],
    null,
    { debug: true }
  );

  return (
    <>
      {debugEnabled && (
        <ScrowlDebugOverlay debugInfo={debugInfo} activeId={activeId} />
      )}

      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setDebugEnabled(!debugEnabled)}
          className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg shadow-lg hover:bg-neutral-800 transition-colors"
        >
          {debugEnabled ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <ul className="space-y-2">
          {SECTION_IDS.map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  activeId === id
                    ? "bg-neutral-900 border-neutral-900 scale-125"
                    : "bg-white border-neutral-300 hover:border-neutral-500"
                }`}
                aria-label={`Go to ${id}`}
              />
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <section
          id="hero"
          ref={registerRef("hero")}
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Debug Mode Demo</h1>
            <p className="text-xl text-neutral-600">
              Scroll down to see the debug overlay in action
            </p>
          </div>
        </section>

        <section
          id="about"
          ref={registerRef("about")}
          className="min-h-screen flex items-center justify-center bg-neutral-100"
        >
          <div className="max-w-2xl text-center px-8">
            <h2 className="text-4xl font-bold mb-6">About</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              The ScrowlDebugOverlay shows real-time scroll position, trigger
              line offset, and section visibility scores. Watch the panel as
              you scroll to understand how Scrowl determines the active section.
            </p>
          </div>
        </section>

        <section
          id="services"
          ref={registerRef("services")}
          className="min-h-screen flex items-center justify-center bg-white"
        >
          <div className="max-w-2xl text-center px-8">
            <h2 className="text-4xl font-bold mb-6">Services</h2>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {["Consulting", "Development", "Design", "Support"].map((s) => (
                <div
                  key={s}
                  className="p-6 bg-neutral-50 rounded-xl border border-neutral-200"
                >
                  <h3 className="font-semibold">{s}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          ref={registerRef("contact")}
          className="min-h-screen flex items-center justify-center bg-neutral-900 text-white"
        >
          <div className="max-w-2xl text-center px-8">
            <h2 className="text-4xl font-bold mb-6">Contact</h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              The debug overlay automatically detects fixed headers and
              calculates the appropriate offset. Try resizing the window
              to see the trigger line adjust.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
