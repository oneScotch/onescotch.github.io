import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Mail } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { SiGithub, SiLinkedin, SiGooglescholar } from "react-icons/si";

export function HeroSection() {
  const socialLinks = [
    { icon: SiGithub, href: personalInfo.github, label: "GitHub" },
    { icon: SiLinkedin, href: personalInfo.linkedin, label: "LinkedIn" },
    { icon: SiGooglescholar, href: personalInfo.googleScholar, label: "Google Scholar" },
  ];

  return (
    <section id="about" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-muted-foreground mb-2">Research Engineer</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4" data-testid="text-hero-name">
              Hello I'm<br />
              <span className="text-primary">{personalInfo.name}</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl" data-testid="text-hero-bio">
              {personalInfo.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-6">
              <Button
                variant="outline"
                asChild
                data-testid="button-download-cv"
              >
                <a href="/attached_assets/4._Wang_Ruisi_CV_1765355476686.pdf" download>
                  <FileText className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
              
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="outline"
                    size="icon"
                    asChild
                    data-testid={`link-hero-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid="link-hero-email"
                >
                  <a href={`mailto:${personalInfo.email}`} aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{personalInfo.affiliation}</span> | {personalInfo.university}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" style={{ width: "calc(100% + 24px)", height: "calc(100% + 24px)", left: "-12px", top: "-12px" }} />
              <Avatar className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 border-4 border-primary/20">
                <AvatarFallback className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-primary/10 text-primary">
                  RW
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
