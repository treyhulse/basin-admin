import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Plus, Settings, Activity, Zap } from "lucide-react"

const tools = [
  {
    id: "file-system",
    name: "File System",
    description: "Access and manipulate files on the local system",
    status: "active",
    version: "1.0.0",
    lastUsed: "5 minutes ago",
    requests: "2,847",
  },
  {
    id: "database",
    name: "Database",
    description: "Query and manage database operations",
    status: "active",
    version: "1.2.1",
    lastUsed: "1 hour ago",
    requests: "1,923",
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Perform web searches and retrieve information",
    status: "active",
    version: "0.9.5",
    lastUsed: "30 minutes ago",
    requests: "756",
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Generate images using AI models",
    status: "inactive",
    version: "0.8.2",
    lastUsed: "2 days ago",
    requests: "234",
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Execute code in various programming languages",
    status: "active",
    version: "1.1.0",
    lastUsed: "15 minutes ago",
    requests: "1,456",
  },
]

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Tools</h1>
          <p className="text-muted-foreground">
            Manage your Model Context Protocol tools and capabilities.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={tool.status === "active" ? "default" : "secondary"}
                    className={tool.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    <Activity className="mr-1 h-3 w-3" />
                    {tool.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">v{tool.version}</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm font-medium">Last Used</span>
                  <p className="text-sm text-muted-foreground">{tool.lastUsed}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Total Requests</span>
                  <p className="text-sm text-muted-foreground">{tool.requests}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${tool.status === "active" ? "text-green-500" : "text-gray-400"}`} />
                    <span className="text-sm text-muted-foreground">
                      {tool.status === "active" ? "Ready" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
