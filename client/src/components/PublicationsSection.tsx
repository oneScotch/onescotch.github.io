import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publications, personalInfo } from "@/lib/data";
import { ExternalLink, FileText, ArrowUpRight, ArrowDownAZ, Calendar, Star } from "lucide-react";
import { SiGithub } from "react-icons/si";

type SortOption = "default" | "citations" | "year";

const sortOptions = [
  { id: "default" as SortOption, label: "Default", icon: Star },
  { id: "citations" as SortOption, label: "Citations", icon: ArrowDownAZ },
  { id: "year" as SortOption, label: "Year", icon: Calendar },
];

export function PublicationsSection() {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedPublications = useMemo(() => {
    const pubs = publications.map((p, idx) => ({ ...p, originalIndex: idx }));
    switch (sortBy) {
      case "citations":
        return [...pubs].sort((a, b) => b.citations - a.citations);
      case "year":
        return [...pubs].sort((a, b) => b.year - a.year);
      default:
        return [...pubs].sort((a, b) => a.originalIndex - b.originalIndex);
    }
  }, [sortBy]);

  const highlightAuthor = (authors: string[]) => {
    return authors.map((author, idx) => {
      const isMe = author.includes("R Wang") || author.includes("Ruisi");
      return (
        <span key={idx}>
          {isMe ? <span className="text-primary font-medium">{author}</span> : author}
          {idx < authors.length - 1 && ", "}
        </span>
      );
    });
  };

  return (
    <section id="publications" className="py-10 md:py-14 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-section-publications">
              Publications & Preprints
            </h2>
            <p className="text-muted-foreground">
              Research in computer vision, motion capture, and 3D human pose estimation.
            </p>
          </div>
          <Button variant="outline" asChild data-testid="link-google-scholar">
            <a href={personalInfo.googleScholar} target="_blank" rel="noopener noreferrer">
              Google Scholar
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground mr-1">Sort by:</span>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = sortBy === option.id;
            return (
              <Button
                key={option.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.id)}
                className={isActive ? "bg-primary text-primary-foreground" : ""}
                data-testid={`sort-${option.id}`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {option.label}
              </Button>
            );
          })}
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
          {sortedPublications.map((pub) => (
            <Card key={pub.id} className="hover-elevate overflow-hidden" data-testid={`card-publication-${pub.id}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-56 lg:w-64 flex-shrink-0 bg-muted/50">
                    {pub.image ? (
                      <img
                        src={pub.image}
                        alt={pub.title}
                        className="aspect-video md:aspect-[4/3] w-full h-full object-cover"
                      />
                    ) : (
                      <div className="aspect-video md:aspect-[4/3] w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary/40 mb-1">{pub.venue}</div>
                          <div className="text-sm text-muted-foreground">{pub.year}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {pub.venue}
                      </Badge>
                      {pub.citations > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {pub.citations} citations
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-2 leading-tight">
                      {pub.arxiv ? (
                        <a
                          href={pub.arxiv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          data-testid={`link-publication-title-${pub.id}`}
                        >
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {highlightAuthor(pub.authors)}
                    </p>
                    {pub.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {pub.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {pub.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pub.github} target="_blank" rel="noopener noreferrer">
                            <SiGithub className="h-4 w-4 mr-1" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {pub.arxiv && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pub.arxiv} target="_blank" rel="noopener noreferrer">
                            arXiv
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {pub.doi && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
