import { ReactNode } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AuthBanner } from "@/components/layout/auth-banner"
import { Footer } from "@/components/layout/footer"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Cool background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 sm:from-blue-50/30 via-background to-purple-50/10 sm:to-purple-50/20" />
        
        {/* Floating geometric shapes - Hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />
        <div className="hidden sm:block absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl" />
        <div className="hidden sm:block absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl" />
        <div className="hidden sm:block absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        
        {/* Subtle grid lines - Smaller on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:64px_64px]" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/30 sm:via-background/50 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <AuthBanner />
        {children}
        <Footer />
      </div>
    </div>
  )
}
