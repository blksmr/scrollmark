import { Heading } from "@/components/Heading";
import { FEATURES } from "@/constants";

export function FeaturesSection() {
  return (
    <section id="features">
      <Heading>Features</Heading>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-baseline gap-2">
            <span className="text-foreground">{feature.title}</span>
            {feature.badge && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {feature.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
