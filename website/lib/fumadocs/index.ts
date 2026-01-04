import { loader } from "fumadocs-core/source";
import { docs } from "@/.source";

const rawSource = docs.toFumadocsSource();
const filesArray =
  typeof rawSource.files === "function"
    ? (rawSource.files as () => typeof rawSource.files)()
    : rawSource.files;

export const source = loader({
  baseUrl: "/",
  source: { files: filesArray },
});

export const getHomePage = () => {
  return source.getPage(["documentation"]);
};

export type Page = ReturnType<typeof source.getPages>[number];
