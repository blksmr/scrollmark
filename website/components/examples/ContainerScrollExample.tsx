"use client";

import { useRef } from "react";
import { useScrowl } from "scrowl";

const PANELS = ["overview", "metrics", "settings", "logs"] as const;

export function ContainerScrollExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeId, registerRef, scrollToSection } = useScrowl(
    [...PANELS],
    containerRef,
    { offset: 0 }
  );

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        {PANELS.map((panel) => (
          <button
            key={panel}
            onClick={() => scrollToSection(panel)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeId === panel
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {panel.charAt(0).toUpperCase() + panel.slice(1)}
          </button>
        ))}
      </header>

      <div
        ref={containerRef}
        className="h-96 overflow-y-auto scroll-smooth"
      >
        <div className="p-6 space-y-8">
          <section
            id="overview"
            ref={registerRef("overview")}
            className="p-6 bg-white rounded-lg border border-neutral-100"
          >
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <p className="text-neutral-600 mb-4">
              This example demonstrates scroll-spy within a scrollable container
              instead of the window. The hook accepts a containerRef as its
              second parameter.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400"
                >
                  Card {i}
                </div>
              ))}
            </div>
          </section>

          <section
            id="metrics"
            ref={registerRef("metrics")}
            className="p-6 bg-white rounded-lg border border-neutral-100"
          >
            <h3 className="text-lg font-semibold mb-3">Metrics</h3>
            <p className="text-neutral-600 mb-4">
              Real-time performance metrics and analytics dashboard.
            </p>
            <div className="space-y-3">
              {["CPU Usage", "Memory", "Network", "Disk I/O"].map((metric) => (
                <div key={metric} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500 w-24">{metric}</span>
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-full"
                      style={{ width: `${Math.random() * 60 + 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="settings"
            ref={registerRef("settings")}
            className="p-6 bg-white rounded-lg border border-neutral-100"
          >
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <p className="text-neutral-600 mb-4">
              Configure your application preferences and options.
            </p>
            <div className="space-y-4">
              {["Notifications", "Dark Mode", "Auto-save", "Analytics"].map(
                (setting) => (
                  <label
                    key={setting}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-neutral-700">{setting}</span>
                    <div className="w-10 h-6 bg-neutral-200 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                    </div>
                  </label>
                )
              )}
            </div>
          </section>

          <section
            id="logs"
            ref={registerRef("logs")}
            className="p-6 bg-white rounded-lg border border-neutral-100"
          >
            <h3 className="text-lg font-semibold mb-3">Logs</h3>
            <p className="text-neutral-600 mb-4">
              System activity and event logs.
            </p>
            <div className="font-mono text-xs space-y-1 bg-neutral-900 text-neutral-300 p-4 rounded-lg">
              <div>[12:00:01] Application started</div>
              <div>[12:00:02] Connected to database</div>
              <div>[12:00:03] Cache initialized</div>
              <div>[12:00:05] Ready to accept connections</div>
              <div>[12:01:23] User session created</div>
              <div>[12:02:45] API request processed</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
