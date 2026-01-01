import { useState } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "features", label: "Features" },
  { id: "getting-started", label: "Getting Started" },
  { id: "api", label: "API" },
];

const FEATURES = [
  {
    title: "Auto Overlay Detection",
    description: "Automatically detects sticky/fixed headers and adjusts scroll offset. No manual config needed.",
    badge: "New",
    href: "#",
  },
  {
    title: "Buttery Smooth",
    description: "RAF + throttling for 60fps performance. No jank, no polling, just smooth.",
    badge: null,
    href: "#",
  },
  {
    title: "Hysteresis Scoring",
    description: "Smart algorithm prevents jittery switching between sections while scrolling.",
    badge: null,
    href: "#",
  },
  {
    title: "Window & Container",
    description: "Works with both window scroll and custom scrollable containers.",
    badge: null,
    href: "#",
  },
  {
    title: "Debug Mode",
    description: "Visual overlay showing scroll position, trigger line, and section scores.",
    badge: "Dev",
    href: "#",
  },
  {
    title: "TypeScript Ready",
    description: "Full type definitions included. Autocomplete everything.",
    badge: null,
    href: "#",
  },
  {
    title: "Copy & Use",
    description: "No installation, no bundling. Just copy the hook file into your project and use it.",
    badge: null,
    href: "#",
  },
];

const API_ITEMS = [
  {
    name: "useScrollSpy(sectionIds, containerRef?, options?)",
    description: "Main hook that tracks which section is currently in view.",
  },
  {
    name: "activeId",
    description: "The ID of the currently active section, or null.",
  },
  {
    name: "registerRef(id)",
    description: "Returns a ref callback to attach to each section element.",
  },
  {
    name: "scrollToSection(id)",
    description: "Programmatically scroll to a specific section.",
  },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Copy Hook", href: "#getting-started" },
  { label: "Examples", href: "#" },
];

// Hook source code - loaded dynamically
let HOOK_SOURCE_CODE_CACHE: string | null = null;

const loadHookSource = async (): Promise<string> => {
  if (HOOK_SOURCE_CODE_CACHE) return HOOK_SOURCE_CODE_CACHE;
  
  try {
    const response = await fetch('/useScrollSpy.tsx');
    const text = await response.text();
    HOOK_SOURCE_CODE_CACHE = text;
    return text;
  } catch {
    // Fallback message if fetch fails
    return `// useScrollSpy hook
// Unable to load source code
// Please visit the GitHub repo to get the complete source code
`;
  }
};
import {
    useRef,
    useState,
    useEffect,
    useCallback,
    useLayoutEffect
}                            from 'react';
import { createRoot }        from 'react-dom/client';
import type { RefObject }    from 'react';
import type { Root }         from 'react-dom/client';

const __DEV__ = import.meta.env.DEV;

type ScrollSpyOptions = {
    offset?: number | 'auto';
    offsetRatio?: number;
    debounceMs?: number;
    debug?: boolean;
};

/**
 * Detects fixed/sticky elements currently at the top of the viewport.
 * Returns the bottom edge of the lowest overlapping element.
 */
const detectTopOverlayHeight = (): number => {
    let maxBottom = 0;

    const allElements = document.querySelectorAll('*');

    for (const el of allElements) {
        if (el === document.documentElement || el === document.body) continue;

        const htmlEl = el as HTMLElement;
        
        // Skip debug overlay elements by ID
        if (htmlEl.id === 'scrollspy-debug-root') continue;
        
        const style = window.getComputedStyle(el);
        const position = style.position;

        if (position !== 'fixed' && position !== 'sticky') continue;

        // Skip debug overlay elements by checking z-index (debug overlay uses 9999, trigger line uses 9998)
        const zIndex = parseInt(style.zIndex, 10);
        if (!isNaN(zIndex) && zIndex >= 9998) continue;

        // Skip elements that are part of the debug overlay by checking parent
        let parent = htmlEl.parentElement;
        let isDebugElement = false;
        while (parent && parent !== document.body) {
            if (parent.id === 'scrollspy-debug-root') {
                isDebugElement = true;
                break;
            }
            parent = parent.parentElement;
        }
        if (isDebugElement) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= 50 && rect.height > 0 && rect.width > 0) {
            maxBottom = Math.max(maxBottom, rect.bottom);
        }
    }

    return maxBottom;
};

type SectionBounds = {
    id: string;
    top: number;
    bottom: number;
    height: number;
};

type DebugInfo = {
    scrollY: number;
    triggerLine: number;
    viewportHeight: number;
    offsetBase: number;
    offsetEffective: number;
    sections: Array<{
        id: string;
        score: number;
        isActive: boolean;
        bounds: SectionBounds;
        visibilityRatio: number;
    }>;
};

type UseScrollSpyReturn = {
    activeId: string | null;
    registerRef: (id: string) => (el: HTMLElement | null) => void;
    scrollToSection: (id: string) => void;
};

type SectionScore = {
    id: string;
    score: number;
    visibilityRatio: number;
    distanceFromTrigger: number;
    isInViewport: boolean;
    bounds: SectionBounds;
};

const VISIBILITY_THRESHOLD = 0.6;
const HYSTERESIS_SCORE_MARGIN = 150;

export const useScrollSpy = (
    sectionIds: string[],
    containerRef: RefObject<HTMLElement> | null = null,
    { offset = 'auto', offsetRatio = 0.08, debounceMs = 10, debug = false }: ScrollSpyOptions = {}
): UseScrollSpyReturn => {
    const isDebugEnabled = __DEV__ && debug;

    // States
    const [activeId, setActiveId] = useState<string | null>(sectionIds[0] || null);
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
    const [detectedOffset, setDetectedOffset] = useState<number>(() => {
        if (offset === 'auto' && typeof window !== 'undefined') {
            return detectTopOverlayHeight();
        }
        return 0;
    });

    // Refs
    const refs = useRef<Record<string, HTMLElement | null>>({});
    const activeIdRef = useRef<string | null>(sectionIds[0] || null);
    const lastScrollY = useRef<number>(0);
    const lastActiveScore = useRef<number>(0);
    const rafId = useRef<number | null>(null);
    const isThrottled = useRef<boolean>(false);
    const throttleTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasPendingScroll = useRef<boolean>(false);
    const debugContainerRef = useRef<HTMLDivElement | null>(null);
    const debugRootRef = useRef<Root | null>(null);
    const lastDebugUpdate = useRef<number>(0);
    const debugUpdateTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Get effective offset (auto-detect or manual)
    const getEffectiveOffset = useCallback((): number => {
        if (offset === 'auto') {
            return detectedOffset || detectTopOverlayHeight();
        }
        return offset;
    }, [offset, detectedOffset]);

    // Detect overlay elements on mount and resize
    useLayoutEffect(() => {
        if (offset !== 'auto') return;

        const updateDetectedOffset = () => {
            const detected = detectTopOverlayHeight();
            setDetectedOffset(detected);
        };

        updateDetectedOffset();
        
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateDetectedOffset, 100);
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [offset]);

    // Re-detect overlay when debug mode changes
    useLayoutEffect(() => {
        if (offset !== 'auto') return;
        
        const timeoutId = setTimeout(() => {
            const detected = detectTopOverlayHeight();
            setDetectedOffset(detected);
        }, 0);
        
        return () => clearTimeout(timeoutId);
    }, [offset, isDebugEnabled]);

    // Callbacks
    const registerRef = useCallback((id: string) => (el: HTMLElement | null) => {
        if (el) {
            refs.current[id] = el;
        } else {
            delete refs.current[id];
        }
    }, []);

    const scrollToSection = useCallback((id: string): void => {
        const element = refs.current[id];
        if (element) {
            const container = containerRef?.current;
            const elementRect = element.getBoundingClientRect();
            
            const effectiveOffset = getEffectiveOffset() + 10;
            
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
                container.scrollTo({
                    top: relativeTop - effectiveOffset,
                    behavior: 'smooth'
                });
            } else {
                const absoluteTop = elementRect.top + window.scrollY;
                window.scrollTo({
                    top: absoluteTop - effectiveOffset,
                    behavior: 'smooth'
                });
            }
            
            activeIdRef.current = id;
            setActiveId(id);
        }
    }, [containerRef, getEffectiveOffset]);

    useEffect(() => {
        activeIdRef.current = activeId;
    }, [activeId]);

    const getSectionBounds = useCallback((): SectionBounds[] => {
        const container = containerRef?.current;
        const scrollTop = container ? container.scrollTop : window.scrollY;
        const containerTop = container ? container.getBoundingClientRect().top : 0;

        return sectionIds
            .map((id) => {
                const el = refs.current[id];
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                const relativeTop = container 
                    ? rect.top - containerTop + scrollTop
                    : rect.top + window.scrollY;
                return {
                    id,
                    top: relativeTop,
                    bottom: relativeTop + rect.height,
                    height: rect.height
                };
            })
            .filter((bounds): bounds is SectionBounds => bounds !== null);
    }, [sectionIds, containerRef]);

    const calculateActiveSection = useCallback(() => {
        const container = containerRef?.current;
        const currentActiveId = activeIdRef.current;
        const scrollY = container ? container.scrollTop : window.scrollY;
        const viewportHeight = container ? container.clientHeight : window.innerHeight;
        const scrollHeight = container ? container.scrollHeight : document.documentElement.scrollHeight;
        const scrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
        lastScrollY.current = scrollY;

        const sections = getSectionBounds();
        if (sections.length === 0) return;

        const baseOffset = getEffectiveOffset();
        const effectiveOffset = Math.max(baseOffset, viewportHeight * offsetRatio);
        const triggerLine = scrollY + effectiveOffset;
        const viewportTop = scrollY;
        const viewportBottom = scrollY + viewportHeight;

        const isAtBottom = scrollY + viewportHeight >= scrollHeight - 5;
        if (isAtBottom && sectionIds.length > 0) {
            const lastId = sectionIds[sectionIds.length - 1];
            activeIdRef.current = lastId;
            setActiveId((prev) => (prev !== lastId ? lastId : prev));
            return;
        }

        const isAtTop = scrollY <= 5;
        if (isAtTop && sectionIds.length > 0) {
            const firstId = sectionIds[0];
            activeIdRef.current = firstId;
            setActiveId((prev) => (prev !== firstId ? firstId : prev));
            return;
        }

        const scores: SectionScore[] = sections.map((section) => {
            const visibleTop = Math.max(section.top, viewportTop);
            const visibleBottom = Math.min(section.bottom, viewportBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityRatio = section.height > 0 ? visibleHeight / section.height : 0;
            const visibleInViewportRatio = viewportHeight > 0 ? visibleHeight / viewportHeight : 0;
            const isInViewport = section.bottom > viewportTop && section.top < viewportBottom;

            let score = 0;

            if (visibilityRatio >= VISIBILITY_THRESHOLD) {
                score += 1000 + (visibilityRatio * 500);
            } else if (isInViewport) {
                score += visibleInViewportRatio * 800;
            }

            const sectionIndex = sectionIds.indexOf(section.id);
            if (scrollDirection === 'down' && isInViewport && section.top <= triggerLine && section.bottom > triggerLine) {
                score += 200;
            } else if (scrollDirection === 'up' && isInViewport && section.top <= triggerLine && section.bottom > triggerLine) {
                score += 200;
            }

            score -= sectionIndex * 0.1;

            return {
                id: section.id,
                score,
                visibilityRatio,
                distanceFromTrigger: 0,
                isInViewport,
                bounds: section
            };
        });

        const visibleScores = scores.filter((s) => s.isInViewport);
        const candidates = visibleScores.length > 0 ? visibleScores : scores;
        candidates.sort((a, b) => b.score - a.score);

        let newActiveId: string | null = null;
        if (candidates.length > 0) {
            const bestCandidate = candidates[0];
            const currentScore = scores.find((s) => s.id === currentActiveId);

            const shouldSwitch = !currentScore
                || !currentScore.isInViewport
                || bestCandidate.score > currentScore.score + HYSTERESIS_SCORE_MARGIN
                || bestCandidate.id === currentActiveId;

            if (shouldSwitch) {
                newActiveId = bestCandidate.id;
                activeIdRef.current = newActiveId;
                lastActiveScore.current = bestCandidate.score;
                setActiveId((prev) => (prev !== newActiveId ? newActiveId : prev));
            } else {
                newActiveId = currentActiveId;
                lastActiveScore.current = currentScore.score;
            }
        }
    }, [sectionIds, getEffectiveOffset, offsetRatio, getSectionBounds, containerRef]);

    // Effects
    useEffect(() => {
        const container = containerRef?.current;
        const scrollTarget = container || window;

        const scheduleCalculate = (): void => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }

            rafId.current = requestAnimationFrame(() => {
                rafId.current = null;
                calculateActiveSection();
            });
        };

        const handleScroll = (): void => {
            if (isThrottled.current) {
                hasPendingScroll.current = true;
                return;
            }

            isThrottled.current = true;
            hasPendingScroll.current = false;

            if (throttleTimeoutId.current) {
                clearTimeout(throttleTimeoutId.current);
            }

            scheduleCalculate();

            throttleTimeoutId.current = setTimeout(() => {
                isThrottled.current = false;
                throttleTimeoutId.current = null;

                if (hasPendingScroll.current) {
                    hasPendingScroll.current = false;
                    handleScroll();
                }
            }, debounceMs);
        };

        const handleResize = (): void => {
            scheduleCalculate();
        };

        calculateActiveSection();

        scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            scrollTarget.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            if (throttleTimeoutId.current) {
                clearTimeout(throttleTimeoutId.current);
                throttleTimeoutId.current = null;
            }
            isThrottled.current = false;
            hasPendingScroll.current = false;
        };
    }, [calculateActiveSection, debounceMs, containerRef]);

    return {
        activeId,
        registerRef,
        scrollToSection
    };
};

export default useScrollSpy;`;

const Index = () => {
  const [debugMode, setDebugMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hookSourceCode, setHookSourceCode] = useState<string>("");
  const [isLoadingHook, setIsLoadingHook] = useState(false);
  
  // offset: 'auto' (default) automatically detects fixed/sticky elements at top
  const { activeId, registerRef, scrollToSection } = useScrollSpy(
    SECTIONS.map((s) => s.id),
    null,
    { debug: debugMode }
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator - Right Side - Horizontal lines stacked vertically */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleNavClick(e, section.id)}
            className="group flex items-center gap-3"
            title={section.label}
          >
            <span 
              className={`text-[10px] transition-opacity duration-200 ${
                activeId === section.id 
                  ? "opacity-100 text-foreground" 
                  : "opacity-0 group-hover:opacity-100 text-gray-400"
              }`}
            >
              {section.label}
            </span>
            <div
              className={`h-[2px] rounded-full transition-all duration-300 ${
                activeId === section.id
                  ? "w-8 bg-primary"
                  : "w-4 bg-gray-300 group-hover:bg-gray-400 group-hover:w-6"
              }`}
            />
          </a>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-[400px] mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-12">
          <div className="text-2xl mb-4">🎲</div>
          <h1 className="text-foreground text-xl font-medium mb-2">
            Welcome to paradice
          </h1>
          <p className="text-[#9d9d9d] text-sm">
            Roll with the best scroll spy for React.
          </p>
        </header>

        {/* Sticky Navigation Pills */}
        <div className="sticky top-0 z-40 mb-6">
          <nav className="-mx-2 px-2 py-2 bg-background">
            <ul className="flex flex-wrap gap-2 text-sm">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    className={`px-3 py-1 rounded-full transition-all duration-200 ${
                      activeId === section.id
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-gray-100 text-[#7c7c7c] hover:bg-gray-200"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Gradient fade - absolute so it doesn't affect layout */}
          <div className="absolute left-0 right-0 top-full h-[50px] bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </div>

        <div className="section-divider" />

        {/* Intro Section */}
        <section
          id="intro"
          ref={registerRef("intro")}
          className="mb-10"
        >
          <p className="text-[#7c7c7c] leading-relaxed">
            <span className="text-foreground font-medium">paradice</span> is a 
            ready-to-use React hook that tracks which section of your page is currently 
            visible. Just copy the hook into your project—no installation needed. Perfect 
            for documentation sites, landing pages, and anywhere you need a table of contents 
            that updates as you scroll.
          </p>
          <p className="text-[#9d9d9d] leading-relaxed mt-4 text-sm">
            Built with RAF + throttling for buttery-smooth 60fps performance. 
            Smart hysteresis prevents jittery section switching. Your users will thank you. ⚡
          </p>
        </section>

        <div className="section-divider" />

        {/* Features Section */}
        <section
          id="features"
          ref={registerRef("features")}
          className="mb-10"
        >
          <h2 className="text-foreground font-medium mb-6">
            Features
          </h2>
          
          <ul className="space-y-5">
            {FEATURES.map((feature) => (
              <li key={feature.title}>
                <div className="flex items-center space-x-2">
                  {feature.title === "Debug Mode" ? (
                    <button
                      onClick={() => setDebugMode(!debugMode)}
                      className={`text-foreground link-hover inline-flex items-center gap-1 transition-colors ${
                        debugMode ? "text-[#7c3aed]" : ""
                      }`}
                    >
                      {feature.title}
                      {debugMode ? " ✓" : ""}
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <a 
                      href={feature.href}
                      className="text-foreground link-hover inline-flex items-center gap-1"
                    >
                      {feature.title}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {feature.badge && (
                    <span className={`badge ${feature.title === "Debug Mode" && debugMode ? "bg-[#7c3aed] text-white" : ""}`}>
                      {feature.title === "Debug Mode" && debugMode ? "Active" : feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-[#9d9d9d] text-sm mt-1">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="section-divider" />

        {/* Getting Started Section */}
        <section
          id="getting-started"
          ref={registerRef("getting-started")}
          className="mb-10"
        >
          <h2 className="text-foreground font-medium mb-6">
            Getting Started
          </h2>
          
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[#7c7c7c] text-sm">
              Copy the hook into your project:
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-foreground rounded-full transition-colors inline-flex items-center gap-1.5"
                  onClick={async () => {
                    if (!hookSourceCode && !isLoadingHook) {
                      setIsLoadingHook(true);
                      const code = await loadHookSource();
                      setHookSourceCode(code);
                      setIsLoadingHook(false);
                    }
                  }}
                >
                  View hook
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
                  <DialogTitle className="text-lg">useScrollSpy.tsx</DialogTitle>
                  <DialogDescription className="text-sm text-[#7c7c7c]">
                    Copy this hook into your project's hooks folder
                  </DialogDescription>
                </DialogHeader>
                <div className="relative flex-1 overflow-hidden p-6">
                  {isLoadingHook ? (
                    <div className="flex items-center justify-center h-full text-[#7c7c7c]">
                      Loading...
                    </div>
                  ) : hookSourceCode ? (
                    <>
                      <pre className="code-block h-full overflow-auto text-xs bg-gray-50 p-4 rounded-md">
                        <code className="block whitespace-pre font-mono text-[#464647]">{hookSourceCode}</code>
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(hookSourceCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute top-8 right-8 p-2.5 bg-background border border-border rounded-md hover:bg-gray-50 transition-colors shadow-sm z-10 flex items-center gap-2 text-sm"
                        title="Copy code"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-[#059669]" />
                            <span className="text-xs text-[#059669]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs">Copy</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#7c7c7c]">
                      Click "View hook" to load the source code
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <pre className="code-block mb-6">
            <code>
              <span className="text-[#6b7280]"># Copy src/hooks/useScrollSpy.tsx to your project</span>{"\n"}
              <span className="text-[#6b7280]"># That's it! No installation needed.</span>
            </code>
          </pre>
          
          <p className="text-[#7c7c7c] text-sm mb-4">
            Basic usage ↓
          </p>
          
          <pre className="code-block">
            <code>
              <span className="text-[#7c3aed]">import</span> {"{"} useScrollSpy {"}"} <span className="text-[#7c3aed]">from</span> <span className="text-[#059669]">'./hooks/useScrollSpy'</span>{"\n\n"}
              <span className="text-[#7c3aed]">function</span> <span className="text-[#2563eb]">TableOfContents</span>() {"{"}{"\n"}
              {"  "}<span className="text-[#7c3aed]">const</span> {"{"} activeId, registerRef, scrollToSection {"}"} = <span className="text-[#2563eb]">useScrollSpy</span>([{"\n"}
              {"    "}<span className="text-[#059669]">'intro'</span>,{"\n"}
              {"    "}<span className="text-[#059669]">'features'</span>,{"\n"}
              {"    "}<span className="text-[#059669]">'api'</span>{"\n"}
              {"  "}]){"\n\n"}
              {"  "}<span className="text-[#7c3aed]">return</span> ({"\n"}
              {"    "}<span className="text-[#6b7280]">{"<>"}</span>{"\n"}
              {"      "}<span className="text-[#2563eb]">{"<nav>"}</span>{"\n"}
              {"        "}<span className="text-[#2563eb]">{"<button"}</span> <span className="text-[#9ca3af]">onClick</span>={"{"}() {"=>"} scrollToSection(<span className="text-[#059669]">'intro'</span>){"}"}<span className="text-[#2563eb]">{">"}</span>Intro<span className="text-[#2563eb]">{"</button>"}</span>{"\n"}
              {"        "}<span className="text-[#2563eb]">{"<button"}</span> <span className="text-[#9ca3af]">onClick</span>={"{"}() {"=>"} scrollToSection(<span className="text-[#059669]">'features'</span>){"}"}<span className="text-[#2563eb]">{">"}</span>Features<span className="text-[#2563eb]">{"</button>"}</span>{"\n"}
              {"      "}<span className="text-[#2563eb]">{"</nav>"}</span>{"\n"}
              {"      "}{"\n"}
              {"      "}<span className="text-[#2563eb]">{"<section"}</span> <span className="text-[#9ca3af]">id</span>=<span className="text-[#059669]">"intro"</span> <span className="text-[#9ca3af]">ref</span>={"{"}registerRef(<span className="text-[#059669]">'intro'</span>){"}"}<span className="text-[#2563eb]">{">"}</span>{"\n"}
              {"        "}...{"\n"}
              {"      "}<span className="text-[#2563eb]">{"</section>"}</span>{"\n"}
              {"    "}<span className="text-[#6b7280]">{"</>"}</span>{"\n"}
              {"  "}){"\n"}
              {"}"}
            </code>
          </pre>
        </section>

        <div className="section-divider" />

        {/* API Section */}
        <section
          id="api"
          ref={registerRef("api")}
          className="mb-10"
        >
          <h2 className="text-foreground font-medium mb-6">
            API
          </h2>
          
          <ul className="space-y-4">
            {API_ITEMS.map((item) => (
              <li key={item.name}>
                <code className="code-inline text-foreground">
                  {item.name}
                </code>
                <p className="text-[#9d9d9d] text-sm mt-1">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-gray-50 rounded text-sm text-[#7c7c7c]">
            <span className="text-foreground">Options:</span>
            <ul className="mt-2 space-y-1 text-[#9d9d9d]">
              <li>• <code className="code-inline">offset</code> — Trigger offset in pixels (default: 100)</li>
              <li>• <code className="code-inline">debounceMs</code> — Debounce delay (default: 10)</li>
            </ul>
          </div>
        </section>

        <div className="section-divider" />

        {/* Footer Links */}
        <footer className="mb-10">
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a 
                  href={link.href}
                  className="text-[#7c7c7c] link-hover text-sm inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </footer>

        <div className="section-divider" />

        {/* Copyright */}
        <div className="text-[#9d9d9d] text-xs">
          <p>© 2026 paradice</p>
          <p className="mt-1">
            Made with ☕ by{" "}
            <a href="#" className="link-hover">
              @developer
            </a>
          </p>
          <p className="mt-3 text-[#c0c0c0]">
            ᕙ(⇀‸↼‶)ᕗ
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
