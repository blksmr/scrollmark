import type { RefCallback } from "react";

type IntroSectionProps = {
  registerRef: RefCallback<HTMLElement>;
};

export function IntroSection({ registerRef }: IntroSectionProps) {
  return (
    <section id="intro" ref={registerRef} className="mb-12">
      <p className="leading-relaxed mb-4">Scrowl is a simple scroll spy hook for React.</p>
      <p className="leading-relaxed mb-4">
        Scrowl simplifies scroll tracking in React by removing the complexity that many developers
        face when setting up scroll spy functionality. By eliminating boilerplate code, it
        streamlines both implementation and maintenance workflows.
      </p>
      <p className="leading-relaxed">
        Built with RAF + throttling for buttery-smooth 60fps performance and smart hysteresis to
        prevent jittery section switching, Scrowl ensures your scroll tracking is both performant
        and reliable by default.
      </p>
      <p className="text-sm mt-4 leading-relaxed">
        For the source code, check out the{" "}
        <a
          href="https://github.com/blksmr/scrowl"
          className="link-hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </section>
  );
}
