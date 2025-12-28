import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { NewsSection } from "@/components/NewsSection";
import { CVSection } from "@/components/CVSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PublicationsSection } from "@/components/PublicationsSection";
import { CompetitionsSection } from "@/components/CompetitionsSection";
import { TeachingSection } from "@/components/TeachingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <NewsSection />
        <CVSection />
        <ResearchSection />
        <PublicationsSection />
        <CompetitionsSection />
        <TeachingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
