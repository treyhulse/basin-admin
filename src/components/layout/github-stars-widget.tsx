"use client"

import * as React from "react"
import { Star, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GitHubRepoData {
  stargazers_count: number
  full_name: string
  html_url: string
}

interface GitHubStarsWidgetProps {
  owner: string
  repo: string
  className?: string
}

export function GitHubStarsWidget({ owner, repo, className }: GitHubStarsWidgetProps) {
  const [stars, setStars] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchStars = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
        
        const data: GitHubRepoData = await response.json()
        setStars(data.stargazers_count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stars')
        console.error('Error fetching GitHub stars:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [owner, repo])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
        <div className="w-8 h-4 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (error) {
    return null // Don't show anything if there's an error
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 gap-1.5 ${className} bg-accent hover:bg-accent/80`}
            onClick={() => window.open(`https://github.com/${owner}/${repo}`, '_blank')}
          >
            <span className="text-sm font-medium">Star Basin on GitHub</span>
            <Star className="h-3 w-3 fill-current" />
            <span className="text-sm font-medium">{stars?.toLocaleString()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View {owner}/{repo} on GitHub</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
