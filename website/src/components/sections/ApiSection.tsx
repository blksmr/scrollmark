import type { RefCallback } from "react";
import { API_ARGUMENTS, API_OPTIONS, API_RETURNS } from "@/constants";

type ApiSectionProps = {
  registerRef: RefCallback<HTMLElement>;
};

export function ApiSection({ registerRef }: ApiSectionProps) {
  return (
    <section id="api" ref={registerRef} className="mb-12">
      <h2 className="text-foreground font-medium mb-6">API</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-foreground font-medium mb-4">Arguments</h3>
          <ul className="space-y-4">
            {API_ARGUMENTS.map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline gap-2 mb-1">
                  <kbd>{item.name}</kbd>
                  <span className="text-sm">{item.type}</span>
                </div>
                <p className="leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-foreground font-medium mb-4">Options</h3>
          <ul className="space-y-4">
            {API_OPTIONS.map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <kbd>{item.name}</kbd>
                  <span className="text-sm">{item.type}</span>
                  <span className="text-sm">= {item.default}</span>
                </div>
                <p className="leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-foreground font-medium mb-4">Returns</h3>
          <ul className="space-y-4">
            {API_RETURNS.map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline gap-2 flex-wrap mb-1">
                  <kbd>{item.name}</kbd>
                  <span className="text-sm">{item.type}</span>
                </div>
                <p className="leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
