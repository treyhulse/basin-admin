"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { LogOut, User, Settings, Building2 } from "lucide-react"

export function AuthSection() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const isMobile = useIsMobile()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="hidden sm:flex items-center space-x-2">
          <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
          <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    )
  }

  // Show user avatar if authenticated
  if (isAuthenticated && user) {
    const fullName = `${user.first_name} ${user.last_name}`.trim()
    const initials = fullName 
      ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : user.email.charAt(0).toUpperCase()

    return (
      <div className="flex items-center space-x-3 sm:space-x-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage alt={fullName || user.email} />
                <AvatarFallback>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {fullName || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/organization" className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Organization</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Show auth buttons if not authenticated (default fallback)
  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <ThemeToggle />
      {/* Mobile auth button - simplified for small screens */}
      {isMobile && (
        <Button size="sm" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      )}
      {/* Desktop auth buttons */}
      <div className="hidden sm:flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
