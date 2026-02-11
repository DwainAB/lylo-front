import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "The AI Experience", href: "/ai-experience" },
  { label: "Atelier", href: "/atelier" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full glass-nav border-b border-primary/10 px-6 lg:px-20 py-2">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-primary">
            <MaterialIcon name="storm" className="text-3xl" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-dark">
            Le studio des parfums
          </h1>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h-4 w-[1px] bg-primary/20 hidden md:block" />

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs font-bold tracking-tighter hover:text-primary transition-colors"
            >
              FR / EN
            </Link>
            <div className="flex gap-3">
              <Button variant="outline" className="hidden sm:flex">
                Login
              </Button>
              <Button variant="primary">Get started</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
