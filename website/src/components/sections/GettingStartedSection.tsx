import { CodeBlock } from "@/components/CodeBlock";
import { Heading } from "@/components/Heading";
import { INSTALL_CODE, USAGE_CODE } from "@/constants";

export function GettingStartedSection() {
  return (
    <section id="getting-started">
      <Heading>Installation</Heading>

      <CodeBlock code={INSTALL_CODE} lang="bash"/>

      <Heading>Usage</Heading>

      <p >
        It can be used anywhere in your application as follows.
      </p>

      <CodeBlock code={USAGE_CODE} lang="tsx" />
    </section>
  );
}
