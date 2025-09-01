import { HeroSection } from "@/components/home/hero-section"
import { UseCasesSection } from "@/components/home/use-cases-section"
import { FeaturesSection } from "@/components/home/features-section"
import { DemoSection } from "@/components/home/demo-section"

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-20 sm:top-40 -z-10 transform-gpu overflow-hidden blur-3xl lg:top-80">
        <div className="relative left-[calc(50%-8rem)] aspect-[1155/678] w-[28rem] -translate-x-2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-11rem)] sm:w-[36.125rem] sm:opacity-30 lg:left-[calc(50%-30rem)] lg:w-[72.1875rem]" />
      </div>
      
      <main className="relative z-10">
        <HeroSection />
        <UseCasesSection />
        <FeaturesSection />
        <DemoSection />
      </main>
    </div>
  )
}
