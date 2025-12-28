import { personalInfo } from "@/lib/data";
import { SiGithub, SiLinkedin, SiGooglescholar } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const socialLinks = [
    { icon: SiGithub, href: personalInfo.github, label: "GitHub" },
    { icon: SiLinkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: SiGooglescholar, href: personalInfo.googleScholar, label: "Google Scholar" },
  ];

  return (
    <footer className="py-8 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>&copy; {currentYear} {personalInfo.name}. All rights reserved.</p>
            <p className="text-xs mt-1">Licensed under CC-BY 4.0</p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
                data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>Last updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
