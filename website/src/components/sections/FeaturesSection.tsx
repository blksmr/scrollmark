import type { RefCallback } from "react";
import { Heading } from "@/components/Heading";
import { FEATURES } from "@/constants";


export function FeaturesSection() {
  return (
    <section id="features" >
      <Heading>Features</Heading>

      <ul className="space-y-6">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <div className="flex items-start gap-2 mb-1">
              {feature.title === "Debug Mode" ? (
                <button
                  className="text-foreground font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                >
                  {feature.title}
                </button>
              ) : (
                <Heading as="h3" className="mb-0">{feature.title}</Heading>
              )}
              {feature.badge && (
                <span className="badge">
                  {feature.badge}
                </span>
              )}
            </div>
            <p >{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
