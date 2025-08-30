import { HeroSection } from "@/components/home/hero-section"
import { UseCasesSection } from "@/components/home/use-cases-section"
import { FeaturesSection } from "@/components/home/features-section"
import { DemoSection } from "@/components/home/demo-section"

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <main>
        <HeroSection />
        <UseCasesSection />
        <FeaturesSection />
        <DemoSection />
      </main>
    </div>
  )
}
