import { Github } from "lucide-react";
import Logo from "./ui/logo";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/20 backdrop-blur-xl">
    <div className="container mx-auto flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-purple-600 flex items-center justify-center">
          <Logo color="#FFF" size={16} />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">
          Divisor
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a
          href="#why-divisor"
          className="hover:text-foreground transition-colors"
        >
          Why Divisor
        </a>
        <a
          href="#how-it-works"
          className="hover:text-foreground transition-colors"
        >
          How it works
        </a>
        <a href="#pricing" className="hover:text-foreground transition-colors">
          Pricing
        </a>
        <a
          href="#implementation"
          className="hover:text-foreground transition-colors"
        >
          Implementation
        </a>
        <a href="#faq" className="hover:text-foreground transition-colors">
          FAQ
        </a>
      </div>
      <a
        href="https://github.com/dennergazevedo/divisor"
        target="_blank"
        rel="noopener no referver"
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-purple-600/50 transition-all"
      >
        <Github className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </nav>
);

export default Navbar;
