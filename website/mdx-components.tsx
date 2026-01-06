import type { MDXComponents } from "mdx/types";
import { Demo } from "@/components/Demo";
import { PropTable } from "@/components/PropTable";
import { CodeBlockProps } from "fumadocs-ui/components/codeblock";

export function getMDXComponents(): MDXComponents {
  return {
    Demo,
    PropTable
  };
}
