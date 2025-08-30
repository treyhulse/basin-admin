import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Plus, Settings, Activity } from "lucide-react"
import Link from "next/link"

const models = [
  {
    id: "gpt4",
    name: "GPT-4",
    provider: "OpenAI",
    status: "active",
    endpoint: "https://api.openai.com/v1",
    lastUsed: "2 hours ago",
    requests: "1,234",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    status: "active",
    endpoint: "https://api.anthropic.com/v1",
    lastUsed: "5 hours ago",
    requests: "856",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    status: "inactive",
    endpoint: "https://generativelanguage.googleapis.com",
    lastUsed: "1 day ago",
    requests: "432",
  },
]

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
          <p className="text-muted-foreground">
            Manage your AI model configurations and connections.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      <div className="grid gap-4">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>{model.provider}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={model.status === "active" ? "default" : "secondary"}
                    className={model.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    <Activity className="mr-1 h-3 w-3" />
                    {model.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/mcp/models/${model.id}`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <span className="text-sm font-medium">Endpoint</span>
                  <p className="text-sm text-muted-foreground truncate">{model.endpoint}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Last Used</span>
                  <p className="text-sm text-muted-foreground">{model.lastUsed}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Total Requests</span>
                  <p className="text-sm text-muted-foreground">{model.requests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
