import { professionalService } from "@/lib/data";
import { Mic, Users, GraduationCap } from "lucide-react";

export function TeachingSection() {
  return (
    <section id="teaching" className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-section-teaching">
          Professional Service
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mic className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Talks:</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {professionalService.talks.map((item) => (
                <li key={item.id} data-testid={`talk-${item.id}`}>
                  <span className="text-foreground">· {item.title}</span>
                  {item.description && (
                    <span className="text-muted-foreground"> - {item.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Event Organizer:</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {professionalService.eventOrganizer.map((item) => (
                <li key={item.id} data-testid={`event-${item.id}`}>
                  <span className="text-foreground">· {item.title}</span>
                  {item.description && (
                    <span className="text-muted-foreground"> - {item.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Teaching:</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {professionalService.teaching.map((item) => (
                <li key={item.id} data-testid={`teaching-${item.id}`}>
                  <span className="text-foreground">· {item.title}</span>
                  {item.description && (
                    <span className="text-muted-foreground"> - {item.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
