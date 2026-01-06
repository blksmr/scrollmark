import {
  rehypeCode,
  rehypeCodeDefaultOptions,
  remarkNpm,
} from "fumadocs-core/mdx-plugins";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { transformerEmptyLines, transformerLineNumbers } from "./lib/shiki-transformers";

export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  lastModifiedTime: "git",
  
  mdxOptions: {
    remarkPlugins: [remarkNpm],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: ["bash", "typescript", "tsx", "javascript", "json", "html", "css", "markdown", "yaml"],
      defaultColor: false,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerEmptyLines(),
        transformerLineNumbers(),
      ]
    },
    rehypePlugins: [rehypeCode],
  }
});
