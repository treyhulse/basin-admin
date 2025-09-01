import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import Link from "next/link"

export function DemoSection() {
  return (
    <section id="demo" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            See Basin in Action
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Watch how easy it is to manage your data collections, create custom views, 
            and integrate with your applications through our powerful API.
          </p>
          
          {/* Demo Video Placeholder */}
          <Card className="border-0 shadow-lg bg-muted/50">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer hover:bg-muted/70 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-primary rounded-full group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 text-sm text-muted-foreground">
                  Click to play demo
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA */}
          <div className="mt-12">
            <Button size="lg" asChild>
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
