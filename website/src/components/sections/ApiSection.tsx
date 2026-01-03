import { useState, type RefCallback } from "react";
import { Heading } from "@/components/Heading";
import { API_ARGUMENTS, API_OPTIONS, API_RETURNS } from "@/constants";

type ApiSectionProps = {
  registerRef: RefCallback<HTMLElement>;
};

const TABS = ["Arguments", "Options", "Returns"] as const;
type Tab = (typeof TABS)[number];

export function ApiSection({ registerRef }: ApiSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Arguments");

  return (
    <section id="api" ref={registerRef} className="mb-12">
      <Heading>API</Heading>

      <div className="flex w-fit gap-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm transition-colors -mb-px border-b-2 ${
              activeTab === tab
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Arguments" && (
        <ul className="space-y-4">
          {API_ARGUMENTS.map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline gap-2 mb-1">
                <kbd>{item.name}</kbd>
                <kbd>{item.type}</kbd>
              </div>
              <p className="leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "Options" && (
        <ul className="space-y-4">
          {API_OPTIONS.map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <kbd>{item.name}</kbd>
                <kbd>{item.type}</kbd> =
                <kbd>{item.default}</kbd>
              </div>
              <p className="leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "Returns" && (
        <ul className="space-y-4">
          {API_RETURNS.map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <kbd>{item.name}</kbd>
                <kbd>{item.type}</kbd>
              </div>
              <p className="leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
