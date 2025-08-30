"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { ArrowRight } from "lucide-react"

export function AuthBanner() {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Don't show banner while loading or if not authenticated
  if (isLoading || !isAuthenticated || !user) {
    return null
  }

  return (
    <div className="bg-primary/10 border-t border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Welcome back,
            </span>
            <span className="text-sm font-medium text-foreground">
              {user.first_name}!
            </span>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
