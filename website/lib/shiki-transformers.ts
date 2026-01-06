import type { ShikiTransformer } from "shiki"

export function transformerEmptyLines(): ShikiTransformer {
  return {
    name: "empty-lines",
    line(node) {
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }]
      }
    },
  }
}

export function transformerLineNumbers(): ShikiTransformer {
  return {
    name: "line-numbers",
    pre(node) {
      const meta = this.options.meta?.__raw || ""
      if (meta.includes("showLineNumbers")) {
        node.properties["data-line-numbers"] = ""
        const lines = String(this.source).split("\n").length
        node.properties["data-line-numbers-max-digits"] = String(lines).length
      }
    },
  }
}
