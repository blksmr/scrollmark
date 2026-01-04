"use client";

import { useScrowl } from "scrowl";

type TocItem = {
  id: string;
  title: string;
  level: number;
};

const TOC_ITEMS: TocItem[] = [
  { id: "getting-started", title: "Getting Started", level: 1 },
  { id: "installation", title: "Installation", level: 2 },
  { id: "quick-start", title: "Quick Start", level: 2 },
  { id: "configuration", title: "Configuration", level: 1 },
  { id: "options", title: "Options", level: 2 },
  { id: "advanced", title: "Advanced Usage", level: 1 },
];

export function TableOfContentsExample() {
  const sectionIds = TOC_ITEMS.map((item) => item.id);
  const { activeId, registerRef, scrollToSection } = useScrowl(sectionIds);

  return (
    <div className="flex gap-12">
      <aside className="sticky top-24 h-fit w-56 shrink-0 border-l border-neutral-200 pl-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">
          On this page
        </p>
        <nav>
          <ul className="space-y-1">
            {TOC_ITEMS.map((item) => (
              <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 }}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`block text-sm py-1 transition-colors ${
                    activeId === item.id
                      ? "text-blue-600 font-medium"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="flex-1 max-w-2xl">
        <section
          id="getting-started"
          ref={registerRef("getting-started")}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
          <p className="text-neutral-600 leading-relaxed">
            Welcome to Scrowl! This guide will help you integrate scroll-spy
            functionality into your React application in just a few minutes.
          </p>
        </section>

        <section
          id="installation"
          ref={registerRef("installation")}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold mb-4">Installation</h3>
          <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-sm">
            npm install scrowl
          </div>
          <p className="text-neutral-600 mt-4 leading-relaxed">
            Scrowl has zero dependencies and works with React 18+.
          </p>
        </section>

        <section
          id="quick-start"
          ref={registerRef("quick-start")}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
          <p className="text-neutral-600 leading-relaxed">
            Import useScrowl, pass your section IDs, and use registerRef to
            connect each section. The hook handles everything else automatically.
          </p>
        </section>

        <section
          id="configuration"
          ref={registerRef("configuration")}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Configuration</h2>
          <p className="text-neutral-600 leading-relaxed">
            Customize Scrowl behavior with options for offset, debouncing,
            and container scrolling.
          </p>
        </section>

        <section id="options" ref={registerRef("options")} className="mb-16">
          <h3 className="text-xl font-semibold mb-4">Options</h3>
          <ul className="space-y-3 text-neutral-600">
            <li>
              <code className="bg-neutral-100 px-2 py-1 rounded text-sm">
                offset
              </code>
              : Pixel offset or &quot;auto&quot; for header detection
            </li>
            <li>
              <code className="bg-neutral-100 px-2 py-1 rounded text-sm">
                offsetRatio
              </code>
              : Viewport ratio for trigger line (default: 0.08)
            </li>
            <li>
              <code className="bg-neutral-100 px-2 py-1 rounded text-sm">
                debounceMs
              </code>
              : Scroll event throttle (default: 10ms)
            </li>
          </ul>
        </section>

        <section id="advanced" ref={registerRef("advanced")} className="mb-32">
          <h2 className="text-3xl font-bold mb-6">Advanced Usage</h2>
          <p className="text-neutral-600 leading-relaxed">
            Use containerRef for scrollable containers, enable debug mode
            with the ScrowlDebugOverlay component, or implement custom
            scroll behavior with scrollToSection.
          </p>
        </section>
      </article>
    </div>
  );
}
