import type { RefCallback } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { INSTALL_CODE, USAGE_CODE } from "@/constants";

type GettingStartedSectionProps = {
  registerRef: RefCallback<HTMLElement>;
};

export function GettingStartedSection({ registerRef }: GettingStartedSectionProps) {
  return (
    <section id="getting-started" ref={registerRef} className="mb-12">
      <h2 className="text-foreground font-medium mb-4">Installation</h2>

      <CodeBlock code={INSTALL_CODE} lang="bash" className="mb-6" />

      <h2 className="text-foreground font-medium mb-4">Usage</h2>

      <p className="leading-relaxed mb-4">
        It can be used anywhere in your application as follows.
      </p>

      <CodeBlock code={USAGE_CODE} lang="tsx" />
    </section>
  );
}
