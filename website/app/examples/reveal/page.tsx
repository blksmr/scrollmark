"use client";

import dynamic from "next/dynamic";

const Reveal = dynamic(
  () => import("@/components/examples/Reveal").then((m) => m.Reveal),
  { ssr: false }
);

export default function Page() {
  return <Reveal />;
}
