"use client";

import dynamic from "next/dynamic";

const TickIndicator = dynamic(
  () => import("@/components/examples/TickIndicator").then((m) => m.TickIndicator),
  { ssr: false }
);

export default function Page() {
  return <TickIndicator />;
}
