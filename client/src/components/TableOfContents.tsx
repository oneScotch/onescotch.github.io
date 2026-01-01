import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const tocItems = [
  { label: "Introduction", href: "#about" },
  { label: "News", href: "#news" },
  { label: "CV", href: "#cv" },
  { label: "Research", href: "#research" },
  // { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Competitions", href: "#competitions" },
  { label: "Professional Service", href: "#teaching" },
  { label: "Contact", href: "#contact" },
];

export function TableOfContents() {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("#about");

  useEffect(() => {
      if (mobileExpanded) return; // Pause scroll tracking when mobile TOC is open
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const sections = tocItems.map(item => ({
              id: item.href,
              element: document.querySelector(item.href)
            }));
            for (let i = sections.length - 1; i >= 0; i--) {
              const section = sections[i];
              if (section.element) {
                const rect = section.element.getBoundingClientRect();
                if (rect.top <= 100) {
                  if (activeSection !== section.id) {
                    setActiveSection(section.id);
                  }
                  break;
                }
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection, mobileExpanded]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(href);
    setMobileExpanded(false);
  };

  return (
    <>
      {/* Desktop TOC */}
      <nav className="hidden lg:block sticky top-8 pt-16 self-start w-56">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Table of Contents</h3>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => scrollToSection(item.href)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors border-l-2 ${
                  activeSection === item.href
                    ? "border-primary text-primary bg-primary/5 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile TOC Toggle */}
      <motion.div
        className="lg:hidden fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="default"
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg"
          onClick={() => setMobileExpanded(true)}
          aria-label="Open table of contents"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Mobile Expanded TOC */}
      <AnimatePresence>
        {mobileExpanded && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileExpanded(false)}
          >
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-lg p-4 shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Table of Contents</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileExpanded(false)}
                  aria-label="Close table of contents"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors border-l-2 ${
                        activeSection === item.href
                          ? "border-primary text-primary bg-primary/5 font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}