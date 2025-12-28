import { Card, CardContent } from "@/components/ui/card";
import { stats } from "@/lib/data";
import { BookOpen, Quote, Award, Trophy } from "lucide-react";

const statItems = [
  { label: "Publications", value: stats.publications, icon: BookOpen },
  { label: "Citations", value: stats.citations, icon: Quote },
  { label: "h-index", value: stats.hIndex, icon: Award },
  { label: "Competition Wins", value: stats.competitions, icon: Trophy },
];

export function StatsSection() {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((stat) => (
            <Card key={stat.label} className="hover-elevate">
              <CardContent className="p-4 md:p-6 text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
