import type { MDXComponents } from "mdx/types";
import { Demo } from "@/components/Demo";
import { PropTable } from "@/components/PropTable";

export function getMDXComponents(): MDXComponents {
  return {
    Demo,
    PropTable,
    blockquote: (props) => <blockquote className="my-4 border-grey border-l-2 py-1 pl-4 font-normal text-muted text-small" {...props} />,
  };
}
