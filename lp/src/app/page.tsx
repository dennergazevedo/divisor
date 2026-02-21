import HeroSection from "./components/HeroSection";
import ValueCards from "./components/ValueCards";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import DeveloperFocus from "./components/DeveloperFocus";
import FAQ from "./components/FAQ";
import OpenSourceSection from "./components/OpenSourceSection";
import FinalCTA from "./components/FinalCTA";

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
