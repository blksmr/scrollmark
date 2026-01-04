"use client";

import { useScrowl } from "scrowl";

const SECTIONS = [
  { id: "desert", label: "Desert", color: "#5c4033" },
  { id: "mountains", label: "Mountains", color: "#16213e" },
  { id: "forest", label: "Forest", color: "#1b4332" },
  { id: "coast", label: "Coast", color: "#0c4a6e" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Basic() {
  const { activeId, registerRef, scrollToSection } = useScrowl(SECTION_IDS, null, {
    offset: 0,
  });

  return (
    <div className="relative min-h-screen bg-white">
      <nav className="fixed right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-3">
        {SECTIONS.map(({ id }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group flex items-center gap-3"
          >
            <span
              className={`block h-0.5 rounded-full bg-black transition-all duration-300 ${
                activeId === id ? "w-6 opacity-100" : "w-4 opacity-20 group-hover:opacity-70"
              }`}
            />
          </button>
        ))}
      </nav>

      <main>
        {SECTIONS.map(({ id, label, color }) => (
          <section
            key={id}
            id={id}
            ref={registerRef(id)}
            className="flex items-center justify-center p-8"
            style={{ minHeight: "100vh" }}
          >
            <div
              className="relative w-full max-w-[430px] overflow-hidden rounded-lg"
              style={{ aspectRatio: "3/2" }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: color }}
              />
              <img src={`/images/${id}.jpg`} alt={label} className="absolute w-full h-full left-0 right-0 top-0 bottom-0 inset-0 object-cover" />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
