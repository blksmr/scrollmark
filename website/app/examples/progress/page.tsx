"use client";

import dynamic from "next/dynamic";

const Progress = dynamic(
  () => import("@/components/examples/Progress").then((m) => m.Progress),
  { ssr: false }
);

export default function Page() {
  return <Progress />;
}
