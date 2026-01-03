import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  IntroSection,
  GettingStartedSection,
  ApiSection,
  FeaturesSection,
} from "@/components/sections";

const Index = () => {
  return (
    <main className="md:max-w-[640px] w-[80%] mx-auto py-32">
      <Header />
      <IntroSection />
      <FeaturesSection />
      <GettingStartedSection />
      <ApiSection />
      <Footer />
    </main>
  );
};

export default Index;
