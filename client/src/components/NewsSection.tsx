import { news } from "@/lib/data";
import { ExternalLink } from "lucide-react";

export function NewsSection() {
  return (
    <section id="news" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-section-news">
          News
        </h2>

        <div className="max-h-80 overflow-y-auto pr-2 space-y-3 scrollbar-thin border rounded-md p-4 bg-background">
          {news.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-sm" data-testid={`news-item-${item.id}`}>
              <span className="text-muted-foreground shrink-0">[{item.date}]</span>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid={`link-news-${item.id}`}
                >
                  {item.content}
                </a>
              ) : (
                <span className="text-foreground">{item.content}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
