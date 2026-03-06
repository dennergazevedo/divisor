import { Metadata } from "next";
import { getAlternates } from "@/lib/metadata";
import HeroSection from "../components/HeroSection";
import ValueCards from "../components/ValueCards";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import DeveloperFocus from "../components/DeveloperFocus";
import FAQ from "../components/FAQ";
import OpenSourceSection from "../components/OpenSourceSection";
import FinalCTA from "../components/FinalCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getAlternates(locale),
  };
}

const Home = () => (
  <div className="min-h-screen bg-background">
    <HeroSection />
    <ValueCards />
    <HowItWorks />
    <Pricing />
    <DeveloperFocus />
    <FAQ />
    <OpenSourceSection />
    <FinalCTA />
  </div>
);

export default Home;
