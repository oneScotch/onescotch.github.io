import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "News", href: "#news" },
  { label: "CV", href: "#cv" },
  { label: "Research", href: "#research" },
  { label: "Publications", href: "#publications" },
  { label: "Competitions", href: "#competitions" },
  { label: "Teaching", href: "#teaching" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <a
            href="#"
            className="font-semibold text-lg"
            data-testid="link-home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Ruisi Wang
          </a>

          <div className="hidden lg:flex items-center gap-1 flex-wrap">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Button>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => scrollToSection(item.href)}
                  data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
