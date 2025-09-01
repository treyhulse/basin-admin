import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import Link from "next/link"

export function DemoSection() {
  return (
    <section id="demo" className="py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            See Basin in Action
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Watch how easy it is to manage your data collections, create custom views, 
            and integrate with your applications through our powerful API.
          </p>
          
          {/* Demo Video Placeholder */}
          <Card className="border-0 shadow-lg bg-muted/50 mx-4 sm:mx-0">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer hover:bg-muted/70 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xs sm:text-sm text-muted-foreground">
                  Click to play demo
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA */}
          <div className="mt-8 sm:mt-12 px-4 sm:px-0">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/login">
                Start Building Today
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
