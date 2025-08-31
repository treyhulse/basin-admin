"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collectionsAPI } from "@/lib/api"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface Collection {
  id: string
  name: string
  display_name: string
  description: string
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('Fetching collections from API...')
        // Temporarily disabled to debug API request issue
        // const response = await collectionsAPI.list({ limit: 100 })
        // console.log('Collections API response:', response)
        
        // if (response && response.data) {
        //   setCollections(response.data)
        //   console.log('Collections loaded:', response.data.length)
        // } else {
        //   console.log('No collections data in response')
        //   setCollections([])
        // }
        
        // For now, just set empty collections to avoid API calls
        setCollections([])
        console.log('Collections API call disabled for debugging')
        
      } catch (error) {
        console.error('Failed to fetch collections:', error)
        setError('Failed to load collections')
        setCollections([])
        
        // Log more details about the error
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as any
          console.error('Error response:', apiError.response?.status, apiError.response?.data)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Transform collections into navigation items
  const collectionsItems = collections.map(collection => ({
    title: collection.display_name || collection.name,
    url: `/dashboard/data/${collection.name.toLowerCase()}`
  }))

  // Fallback items if no collections are loaded
  const fallbackItems = [
    {
      title: "Sample Collection",
      url: "/dashboard/data/sample"
    }
  ]

  // Use collections as navigation items, or fallback if none available
  const allItems = collectionsItems.length > 0 ? collectionsItems : fallbackItems

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {isLoading ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Loading collections...
                    </div>
                  ) : error ? (
                    <div className="px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  ) : allItems.length > 0 ? (
                    allItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No collections available
                    </div>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
