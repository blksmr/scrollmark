import type { MDXComponents } from "mdx/types";
import { Examples } from "@/components/examples";
import { Iframe } from "@/components/Iframe";

export function getMDXComponents(): MDXComponents {
  return {
    ...Examples,
    Iframe,
  };
}
