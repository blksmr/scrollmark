import { useEffect, useRef } from "react";
import { getHighlighter, type Highlighter } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: "typescript" | "tsx" | "bash" | "shell";
  className?: string;
}

let highlighterPromise: Promise<Highlighter> | null = null;

const getShikiHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["github-light"],
      langs: ["typescript", "tsx", "bash", "shell"],
    });
  }
  return highlighterPromise;
};

export const CodeBlock = ({ code, lang = "typescript", className = "" }: CodeBlockProps) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let cancelled = false;

    if (preRef.current) {
      preRef.current.textContent = code;
    }

    getShikiHighlighter().then((highlighter) => {
      if (cancelled || !preRef.current) return;
      const result = highlighter.codeToHtml(code, {
        lang,
        theme: "github-light",
      });
      const temp = document.createElement("div");
      temp.innerHTML = result;
      const pre = temp.querySelector("pre");
      if (pre && preRef.current) {
        preRef.current.innerHTML = pre.innerHTML;
        preRef.current.style.cssText = pre.style.cssText;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return <pre ref={preRef} className={`shiki ${className}`.trim()} />;
};
