import type { MDXComponents } from "mdx/types";
import { Demo } from "@/components/Demo";
import { PropTable } from "@/components/PropTable";

export function getMDXComponents(): MDXComponents {
  return {
    Demo,
    PropTable,
    table: (props) => (
      <div className="table-wrapper">
        <table {...props} />
      </div>
    ),
  };
}
