import type { RefCallback } from "react";
import { Heading } from "@/components/Heading";
import { FEATURES } from "@/constants";

type FeaturesSectionProps = {
  registerRef: RefCallback<HTMLElement>;
  debugMode: boolean;
  onToggleDebug: () => void;
};

export function FeaturesSection({ registerRef, debugMode, onToggleDebug }: FeaturesSectionProps) {
  return (
    <section id="features" ref={registerRef} className="mb-12">
      <Heading>Features</Heading>

      <ul className="space-y-6">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <div className="flex items-start gap-2 mb-1">
              {feature.title === "Debug Mode" ? (
                <button
                  onClick={onToggleDebug}
                  className="text-foreground font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                >
                  {feature.title}
                  {debugMode ? " ✓" : ""}
                </button>
              ) : (
                <Heading as="h3" className="mb-0">{feature.title}</Heading>
              )}
              {feature.badge && (
                <span className="badge">
                  {feature.title === "Debug Mode" && debugMode ? "Active" : feature.badge}
                </span>
              )}
            </div>
            <p className="leading-relaxed">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
