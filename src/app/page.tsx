import { Navbar } from "@/components/layout/navbar"
import { AuthBanner } from "@/components/layout/auth-banner"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { DemoSection } from "@/components/home/demo-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthBanner />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  )
}
