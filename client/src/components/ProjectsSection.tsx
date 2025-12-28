import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/data";
import { ExternalLink, Award, Calendar } from "lucide-react";
import { SiGithub } from "react-icons/si";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-10 md:py-14 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-section-projects">
          Projects
        </h2>
        <p className="text-muted-foreground mb-8">
          Research projects and technical implementations in computer vision and machine learning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover-elevate flex flex-col" data-testid={`card-project-${project.id}`}>
              <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  {project.achievement && (
                    <Badge className="flex-shrink-0 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 border">
                      <Award className="h-3 w-3 mr-1" />
                      {project.achievement}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  {project.period}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {project.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="self-start"
                    data-testid={`button-project-github-${project.id}`}
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <SiGithub className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
