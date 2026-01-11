"use client";

import dynamic from "next/dynamic";

const Container = dynamic(
  () => import("@/components/examples/Container").then((m) => m.Container),
  { ssr: false }
);

export default function Page() {
  return <Container />;
}
