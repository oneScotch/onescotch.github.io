import { Card, CardContent } from "@/components/ui/card";
import { researchThemes } from "@/lib/data";
import { Eye, Cpu, Brain, Video } from "lucide-react";

const iconMap: Record<string, typeof Eye> = {
  Eye,
  Cpu,
  Brain,
  Video,
};

function SmplIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="4" r="2.5" />
      <path d="M12 8v4" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M12 12l-4 6" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M12 12l4 6" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M8 10l-3 2" strokeWidth="2" stroke="currentColor" fill="none" />
      <path d="M16 10l3 2" strokeWidth="2" stroke="currentColor" fill="none" />
    </svg>
  );
}

export function ResearchSection() {
  return (
    <section id="research" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-section-research">
          Research
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          My research focuses on understanding and reconstructing human motion from visual data. I develop deep learning methods for 3D human pose estimation, motion capture, and motion generation, with applications in animation, sports analytics, and digital humans.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {researchThemes.map((theme) => {
            const isSmplIcon = theme.icon === "User" || theme.icon === "Zap";
            const Icon = iconMap[theme.icon] || Eye;
            return (
              <Card key={theme.id} className="hover-elevate">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    {isSmplIcon ? (
                      <SmplIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <Icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm leading-tight" data-testid={`text-research-theme-${theme.id}`}>
                    {theme.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
