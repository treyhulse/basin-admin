import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Database, 
  Eye, 
  Key, 
  Shield, 
  Zap, 
  BarChart3 
} from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Data Collections",
    description: "Organize and structure your data with flexible collection schemas and relationships."
  },
  {
    icon: Eye,
    title: "Data Views",
    description: "Create custom views and dashboards to visualize and analyze your data effectively."
  },
  {
    icon: Key,
    title: "API Management",
    description: "Secure API keys and endpoints for seamless integration with your applications."
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permissions and user management to keep your data secure."
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant data synchronization and real-time notifications across your platform."
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Comprehensive analytics and reporting to understand your data usage patterns."
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to manage your data
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Basin provides a comprehensive suite of tools designed to streamline your data operations 
            and empower your team to work more efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
