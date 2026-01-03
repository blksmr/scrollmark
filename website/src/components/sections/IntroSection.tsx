import type { RefCallback } from "react";

type IntroSectionProps = {
  registerRef: RefCallback<HTMLElement>;
};

export function IntroSection({ registerRef }: IntroSectionProps) {
  return (
    <section id="intro" ref={registerRef} className="mb-12">
      <p className="leading-relaxed mb-4">
        Scrowl is a lightweight scroll spy hook for React. Track which section is in view, highlight nav
        items, and build smooth scrolling experiences.
      </p>
      <p className="leading-relaxed">
        Uses <kbd>requestAnimationFrame</kbd> with throttling for 60fps performance. Hysteresis prevents
        jittery switching near section boundaries.
      </p>
      <p className="text-sm mt-4 leading-relaxed">
        {"For the source code, check out the "}
        <a
          href="https://github.com/blksmr/scrowl"
          className="link-hover"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
      </p>
    </section>
  );
}
