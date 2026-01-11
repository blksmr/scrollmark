"use client";

import dynamic from "next/dynamic";

const TreeView = dynamic(
  () => import("@/components/examples/TreeView").then((m) => m.TreeView),
  { ssr: false }
);

export default function Page() {
  return <TreeView />;
}
