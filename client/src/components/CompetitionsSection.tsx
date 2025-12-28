import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { competitions } from "@/lib/data";
import { Trophy, Medal, Cpu, Lightbulb, GraduationCap, Atom, Brain } from "lucide-react";

const typeIcons: Record<string, typeof Trophy> = {
  hpc: Cpu,
  hackathon: Lightbulb,
  academic: GraduationCap,
};

const achievementStyles: Record<string, string> = {
  "1st Place": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  "1st Runner-up": "bg-gray-300/20 text-gray-600 dark:text-gray-300 border-gray-400/30",
  "Overall Runner-up & Best Poster": "bg-gray-300/20 text-gray-600 dark:text-gray-300 border-gray-400/30",
  "Finalist": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Top 10": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  "6th Overall": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  "National 2nd Prize": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
};

const categories = [
  { id: "all", label: "All", icon: Trophy },
  { id: "hpc", label: "HPC", icon: Cpu },
  { id: "ai", label: "AI", icon: Brain },
  { id: "quantum", label: "Quantum Computing", icon: Atom },
  { id: "physics", label: "Physics Olympiad", icon: GraduationCap },
];

export function CompetitionsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCompetitions = activeCategory === "all" 
    ? competitions 
    : competitions.filter(comp => comp.category === activeCategory);

  return (
    <section id="competitions" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-section-competitions">
          Competitions & Awards
        </h2>
        <p className="text-muted-foreground mb-6">
          Achievements in High Performance Computing competitions, hackathons, and academic olympiads.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={isActive ? "bg-primary text-primary-foreground" : ""}
                data-testid={`tab-${cat.id}`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredCompetitions.map((comp) => {
            const Icon = typeIcons[comp.type] || Trophy;
            const achievementClass = Object.entries(achievementStyles).find(([key]) => 
              comp.achievement.includes(key.replace("& Best Poster", "").trim()) || comp.achievement === key
            )?.[1] || "bg-primary/10 text-primary border-primary/30";

            return (
              <Card key={comp.id} className="hover-elevate" data-testid={`card-competition-${comp.id}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={`${achievementClass} border`}>
                          {comp.achievement.includes("1st") && <Trophy className="h-3 w-3 mr-1" />}
                          {comp.achievement.includes("Runner") && <Medal className="h-3 w-3 mr-1" />}
                          {comp.achievement}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{comp.date}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{comp.title}</h3>
                      <p className="text-sm text-muted-foreground">{comp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
