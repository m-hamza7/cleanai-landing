import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WorkflowSection } from "@/components/workflow-section"
import { FeaturesSection } from "@/components/features-section"
import { TechnologySection } from "@/components/technology-section"
import { ImpactSection } from "@/components/impact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <TechnologySection />
      <ImpactSection />
      <Footer />
    </main>
  )
}
