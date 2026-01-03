export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "features", label: "Features" },
  { id: "getting-started", label: "Getting Started" },
  { id: "api", label: "API" },
];

export const FEATURES = [
  {
    title: "Auto Overlay Detection",
    description: "Automatically detects sticky/fixed headers and adjusts scroll offset. No manual config needed.",
    badge: "New",
  },
  {
    title: "Buttery Smooth",
    description: "RAF + throttling for 60fps performance. No jank, no polling, just smooth.",
    badge: null,
  },
  {
    title: "Hysteresis Scoring",
    description: "Smart algorithm prevents jittery switching between sections while scrolling.",
    badge: null,
  },
  {
    title: "Window & Container",
    description: "Works with both window scroll and custom scrollable containers.",
    badge: null,
  },
  {
    title: "Debug Mode",
    description: "Visual overlay showing scroll position, trigger line, and section scores.",
    badge: "Dev",
  },
  {
    title: "TypeScript Ready",
    description: "Full type definitions included. Autocomplete everything.",
    badge: null,
  },
  {
    title: "Copy & Use",
    description: "No installation, no bundling. Just copy the hook file into your project and use it.",
    badge: null,
  },
];

export const API_ARGUMENTS = [
  {
    name: "sectionIds",
    type: "string[]",
    description: "Array of section IDs to track.",
  },
  {
    name: "containerRef",
    type: "RefObject<HTMLElement> | null",
    description: "Optional scrollable container. Defaults to window.",
  },
  {
    name: "options",
    type: "ScrowlOptions",
    description: "Configuration options (see below).",
  },
];

export const API_OPTIONS = [
  {
    name: "offset",
    type: "number | 'auto'",
    default: "'auto'",
    description: "Trigger offset from top. 'auto' detects sticky/fixed headers.",
  },
  {
    name: "offsetRatio",
    type: "number",
    default: "0.08",
    description: "Viewport ratio for trigger line calculation.",
  },
  {
    name: "debounceMs",
    type: "number",
    default: "10",
    description: "Throttle delay in milliseconds.",
  },
  {
    name: "debug",
    type: "boolean",
    default: "false",
    description: "Enables debug mode with debugInfo in return value.",
  },
];

export const API_RETURNS = [
  {
    name: "activeId",
    type: "string | null",
    description: "The ID of the currently active section.",
  },
  {
    name: "registerRef(id)",
    type: "(el: HTMLElement | null) => void",
    description: "Ref callback to attach to each section element.",
  },
  {
    name: "scrollToSection(id)",
    type: "(id: string) => void",
    description: "Programmatically scroll to a specific section.",
  },
  {
    name: "debugInfo",
    type: "DebugInfo",
    description: "Debug data (only when debug: true).",
  },
];

export const INSTALL_CODE = `npm install scrowl`;

export const USAGE_CODE = `import { useScrowl } from 'scrowl'

function TableOfContents() {
  const { activeId, registerRef, scrollToSection } = useScrowl([
    'intro',
    'features',
    'api'
  ])

  return (
    <>
      <nav>
        <button onClick={() => scrollToSection('intro')}>Intro</button>
        <button onClick={() => scrollToSection('features')}>Features</button>
      </nav>

      <section id="intro" ref={registerRef('intro')}>
        ...
      </section>
    </>
  )
}`;
