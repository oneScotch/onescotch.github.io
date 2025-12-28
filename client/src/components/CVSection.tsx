import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { education, experience, awards } from "@/lib/data";
import { GraduationCap, Briefcase, Award } from "lucide-react";

export function CVSection() {
  return (
    <section id="cv" className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-section-cv">
          Curriculum Vitae
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="h-5 w-5 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground mb-2">{edu.period}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{edu.honors}</Badge>
                    <Badge variant="outline">{edu.minor}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.scholarship}</p>
                  <p className="text-sm text-muted-foreground mb-4">Specialization: {edu.specialization}</p>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <h5 className="flex items-center gap-2 font-medium text-sm mb-3">
                      <Award className="h-4 w-4 text-primary" />
                      Academic Awards
                    </h5>
                    <div className="space-y-2">
                      {awards.map((award, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium">{award.title}</span>
                            <span className="text-sm text-muted-foreground ml-2">({award.date})</span>
                            {award.description && (
                              <p className="text-sm text-muted-foreground">{award.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
