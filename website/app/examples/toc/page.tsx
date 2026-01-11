"use client";

import dynamic from "next/dynamic";

const Toc = dynamic(
  () => import("@/components/examples/Toc").then((m) => m.Toc),
  { ssr: false }
);

export default function Page() {
  return <Toc />;
}
