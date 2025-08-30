import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Play, Square, Settings, Activity } from "lucide-react"

export default function MCPServerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">MCP Server</h1>
        <p className="text-muted-foreground">
          Manage your Model Context Protocol server configuration and status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Server Status
            </CardTitle>
            <CardDescription>
              Current server status and health information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Activity className="mr-1 h-3 w-3" />
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Port</span>
              <span className="text-sm text-muted-foreground">3001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm text-muted-foreground">2d 14h 32m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connections</span>
              <span className="text-sm text-muted-foreground">12 active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Server configuration and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Host</span>
              <span className="text-sm text-muted-foreground">0.0.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Protocol</span>
              <span className="text-sm text-muted-foreground">HTTP/2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">TLS</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rate Limiting</span>
              <Badge variant="outline">1000 req/min</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Server Controls</CardTitle>
          <CardDescription>
            Start, stop, and restart the MCP server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Start Server
            </Button>
            <Button variant="outline">
              <Square className="mr-2 h-4 w-4" />
              Stop Server
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
