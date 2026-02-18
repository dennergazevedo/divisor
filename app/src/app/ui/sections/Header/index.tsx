import { Github } from "lucide-react";
import Logo from "../../atoms/Logo";

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
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
      >
        <Github className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </nav>
);

export default Navbar;
