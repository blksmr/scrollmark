import { useState } from "react";
import { useScrowl, ScrowlDebugOverlay } from "scrowl";
import { SECTIONS } from "@/constants";
import { Header } from "@/components/Header";
import { Demo } from "@/components/Demo";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import {
  IntroSection,
  FeaturesSection,
  GettingStartedSection,
  ApiSection,
} from "@/components/sections";

const Index = () => {
  const [debugMode, setDebugMode] = useState(false);

  const scrowlResult = useScrowl(
    SECTIONS.map((s) => s.id),
    null,
    debugMode ? { debug: true } : undefined
  );

  const { activeId, registerRef, scrollToSection } = scrowlResult;
  const debugInfo = debugMode ? scrowlResult.debugInfo : null;

  return (
    <>
      <main className="md:max-w-[640px] w-[80%] mx-auto py-32">
        <Header />
        <IntroSection registerRef={registerRef("intro")} />
        <GettingStartedSection registerRef={registerRef("getting-started")} />
        <ApiSection registerRef={registerRef("api")} />
        <Footer />
      </main>

      {debugMode && debugInfo && (
        <ScrowlDebugOverlay debugInfo={debugInfo} activeId={activeId} />
      )}
    </>
  );
};

export default Index;
