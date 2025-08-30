"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Generate breadcrumbs from the current pathname
  const generateBreadcrumbs = (path: string) => {
    const segments = path.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Always start with Dashboard
    breadcrumbs.push({
      title: 'Dashboard',
      href: '/dashboard',
      isCurrent: segments.length === 1
    })
    
    // Add other segments
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      const href = `/${segments.slice(0, i + 1).join('/')}`
      
      // Convert segment to readable title
      let title = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Handle special cases
      if (segment === 'api-keys') title = 'API Keys'
      if (segment === 'data-views') title = 'Data Views'
      if (segment === 'roles') title = 'Roles & Permissions'
      
      breadcrumbs.push({
        title,
        href,
        isCurrent: i === segments.length - 1
      })
    }
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs(pathname)
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-6 w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumb.isCurrent ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Right side of header - can be used for user actions, notifications, etc. */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {/* Add any additional header actions here */}
      </div>
    </header>
  )
}
