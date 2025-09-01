"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo')
    if (demoSection) {
      demoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Build
            <span className="text-primary"> headless infrastructure</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            without the heavy lifting.
          </h1>
          
          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base leading-7 text-muted-foreground sm:text-lg lg:text-xl max-w-3xl mx-auto">
            Go from schema to scalable APIs, MCP servers, and secure access in seconds.
          </p>
          
          {/* Feature Highlights */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-center">AI-Powered MCP Integration</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-center">Role-Based Access Control</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-center">Multi-tenant Architecture</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button size="lg" asChild className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg">
              <Link href="/login">
                Start Building Free
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToDemo}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg"
            >
              See It In Action
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
