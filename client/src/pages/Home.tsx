import { TableOfContents } from "@/components/TableOfContents";
import { HeroSection } from "@/components/HeroSection";
import { NewsSection } from "@/components/NewsSection";
import { CVSection } from "@/components/CVSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PublicationsSection } from "@/components/PublicationsSection";
import { CompetitionsSection } from "@/components/CompetitionsSection";
import { TeachingSection } from "@/components/TeachingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { VirtualToc } from "@/components/VirtualToc";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="lg:flex lg:items-start lg:gap-8">
          <TableOfContents />
          <main className="flex-1 lg:min-w-[50rem] max-w-4xl">
            <HeroSection />
            <NewsSection />
            <CVSection />
            <ResearchSection />
            <PublicationsSection />
            <CompetitionsSection />
            <TeachingSection />
            <ContactSection />
          </main>
          <div className="hidden 2xl:block">
            <VirtualToc />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
