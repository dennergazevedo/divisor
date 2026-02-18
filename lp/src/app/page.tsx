import HeroSection from "./components/HeroSection";
import ValueCards from "./components/ValueCards";
import HowItWorks from "./components/HowItWorks";
import DeveloperFocus from "./components/DeveloperFocus";
import ArchitectureSection from "./components/ArchitectureSection";
import OpenSourceSection from "./components/OpenSourceSection";
import FinalCTA from "./components/FinalCTA";

const Home = () => (
  <div className="min-h-screen bg-background">
    <HeroSection />
    <ValueCards />
    <HowItWorks />
    <DeveloperFocus />
    <ArchitectureSection />
    <OpenSourceSection />
    <FinalCTA />
  </div>
);

export default Home;
