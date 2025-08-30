import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Database, 
  Eye, 
  Key, 
  Shield, 
  Zap, 
  BarChart3,
  Lock,
  Globe
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Database,
    title: "Model your data visually",
    href: "/features/data-modeling",
    color: "blue"
  },
  {
    icon: Eye,
    title: "Get instant APIs",
    href: "/features/apis",
    color: "green"
  },
  {
    icon: Key,
    title: "Connect any databases",
    href: "/features/databases",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Implement policy-based auth",
    href: "/features/auth",
    color: "orange"
  },
  {
    icon: Zap,
    title: "Write custom extensions",
    href: "/features/extensions",
    color: "indigo"
  },
  {
    icon: Lock,
    title: "Retain total control",
    href: "/features/control",
    color: "teal"
  },
  {
    icon: Globe,
    title: "Scale globally",
    href: "/features/scaling",
    color: "pink"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Backend setup in minutes, not months
          </h2>
        </div>
        
        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
          {/* Top Row - 3 columns */}
          <div className="col-span-4">
            <Link href={features[0].href}>
                             <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                 <CardHeader className="pb-4">
                                       <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                      {features[0].title}
                    </CardTitle>
                    <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-start justify-start group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                          <div className="w-16 h-2 bg-gray-300 group-hover:bg-primary/60 rounded transition-colors duration-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                          <div className="w-20 h-2 bg-gray-300 group-hover:bg-primary/60 rounded transition-colors duration-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                          <div className="w-14 h-2 bg-gray-300 group-hover:bg-primary/60 rounded transition-colors duration-300"></div>
                        </div>
                      </div>
                    </div>
                 </CardHeader>
               </Card>
            </Link>
          </div>
          
          <div className="col-span-4">
            <Link href={features[1].href}>
                             <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                 <CardHeader className="pb-4">
                                       <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                      {features[1].title}
                    </CardTitle>
                    <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-1 h-1 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-2 h-2 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-1 h-1 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-2 h-2 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                      </div>
                      <div className="mx-2 w-8 h-px bg-gray-300 group-hover:bg-primary/60 transition-colors duration-300"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-1 h-1 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                        <div className="w-2 h-2 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                      </div>
                    </div>
                 </CardHeader>
               </Card>
            </Link>
          </div>
          
          <div className="col-span-4">
            <Link href={features[2].href}>
              <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardHeader className="pb-4">
                                     <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                     {features[2].title}
                   </CardTitle>
                   <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                     <div className="flex items-center space-x-2">
                       <div className="w-8 h-8 bg-gray-300 group-hover:bg-primary/60 rounded-full flex items-center justify-center transition-colors duration-300">
                         <Database className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                       </div>
                       <div className="w-8 h-8 bg-gray-300 group-hover:bg-primary/60 rounded-full flex items-center justify-center transition-colors duration-300">
                         <Database className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                       </div>
                       <div className="w-8 h-8 bg-gray-300 group-hover:bg-primary/60 rounded-full flex items-center justify-center transition-colors duration-300">
                         <Database className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                       </div>
                     </div>
                   </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
          
          {/* Bottom Row - 4 columns with different widths */}
          <div className="col-span-3">
            <Link href={features[3].href}>
              <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardHeader className="pb-4">
                                     <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                     {features[3].title}
                   </CardTitle>
                   <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                     <div className="grid grid-cols-3 gap-1">
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="w-6 h-6 bg-gray-200 group-hover:bg-primary/40 rounded flex items-center justify-center transition-colors duration-300">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                     </div>
                   </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
          
          <div className="col-span-3">
            <Link href={features[4].href}>
              <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardHeader className="pb-4">
                                     <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                     {features[4].title}
                   </CardTitle>
                   <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                     <div className="w-full max-w-[200px] bg-white dark:bg-gray-800 rounded border p-2">
                       <div className="flex space-x-1 mb-2">
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                         <div className="w-3 h-3 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300"></div>
                       </div>
                       <div className="space-y-1">
                         <div className="w-16 h-2 bg-gray-200 group-hover:bg-primary/40 rounded transition-colors duration-300"></div>
                         <div className="w-20 h-2 bg-gray-200 group-hover:bg-primary/40 rounded transition-colors duration-300"></div>
                         <div className="w-14 h-2 bg-gray-200 group-hover:bg-primary/40 rounded transition-colors duration-300"></div>
                       </div>
                     </div>
                   </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
          
          <div className="col-span-3">
            <Link href={features[5].href}>
              <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardHeader className="pb-4">
                                     <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                     {features[5].title}
                   </CardTitle>
                   <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                     <div className="relative">
                       <div className="w-8 h-8 bg-gray-400 group-hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                         <Lock className="w-4 h-4 text-white" />
                       </div>
                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute top-1/2 -left-2 w-3 h-3 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute top-1/2 -right-2 w-3 h-3 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                     </div>
                   </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
          
          <div className="col-span-3">
            <Link href={features[6].href}>
              <Card className="h-full border-0 shadow-sm transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer group">
                <CardHeader className="pb-4">
                                     <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                     {features[6].title}
                   </CardTitle>
                   <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg p-3 flex items-center justify-center group-hover:bg-gradient-radial group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent dark:group-hover:from-primary/30 dark:group-hover:via-primary/20 dark:group-hover:to-transparent transition-all duration-300">
                     <div className="relative">
                       <div className="w-8 h-8 bg-gray-400 group-hover:bg-primary rounded-full transition-colors duration-300">
                         <Globe className="w-4 h-4 text-white" />
                       </div>
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute top-1/4 -left-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute top-1/4 -right-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute bottom-1/4 -left-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                       <div className="absolute bottom-1/4 -right-1 w-2 h-2 bg-gray-300 group-hover:bg-primary/60 rounded-full transition-colors duration-300"></div>
                     </div>
                   </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
