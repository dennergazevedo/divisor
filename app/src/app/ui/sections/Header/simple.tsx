import Logo from "../../atoms/Logo";
import Link from "next/link";

const SimpleNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/20 backdrop-blur-xl">
    <div className="container mx-auto flex h-16 items-center justify-center px-6">
      <Link href="/" className="flex justify-center items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-purple-600 flex items-center justify-center">
          <Logo color="#FFF" size={16} />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">
          Divisor
        </span>
      </Link>
    </div>
  </nav>
);

export default SimpleNavbar;
