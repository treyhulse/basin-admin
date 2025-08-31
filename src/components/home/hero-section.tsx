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
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Build
            <span className="text-primary"> headless infrastructure</span>
            <br />
            without the heavy lifting.
          </h1>
          
          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            Go from schema to scalable APIs, MCP servers, and secure access in seconds.
          </p>
          
          {/* Feature Highlights */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>AI-Powered MCP Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Multi-tenant Architecture</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild className="px-8 py-3 text-lg">
              <Link href="/login">
                Start Building Free
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToDemo}
              className="px-8 py-3 text-lg"
            >
              See It In Action
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
