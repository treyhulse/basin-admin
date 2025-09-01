"use client"

import {
  Building2,
  ChevronRight,
  Crown,
  Database,
  KeyRound,
  Settings,
  Shield,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

export function NavCore() {
  const pathname = usePathname()

  // Core system navigation data
  const coreSections = [
    {
      title: "Users & Access",
      icon: Users,
      defaultOpen: false, // No routes exist yet
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
          isActive: pathname.startsWith("/dashboard/users"),
        },
        {
          title: "Roles",
          url: "/dashboard/roles",
          icon: Crown,
          isActive: pathname.startsWith("/dashboard/roles"),
        },
        {
          title: "Permissions",
          url: "/dashboard/permissions",
          icon: Shield,
          isActive: pathname.startsWith("/dashboard/permissions"),
        },
        {
          title: "User Roles",
          url: "/dashboard/user-roles",
          icon: UserCheck,
          isActive: pathname.startsWith("/dashboard/user-roles"),
        },
      ],
    },
    {
      title: "Organization",
      icon: Building2,
      defaultOpen: pathname.startsWith("/dashboard/organization"),
      items: [
        {
          title: "Tenants",
          url: "/dashboard/tenants",
          icon: Building2,
          isActive: pathname.startsWith("/dashboard/tenants"),
        },
        {
          title: "User Tenants",
          url: "/dashboard/user-tenants",
          icon: UserCheck,
          isActive: pathname.startsWith("/dashboard/user-tenants"),
        },
      ],
    },
    {
      title: "Data Management",
      icon: Database,
      defaultOpen: pathname.startsWith("/dashboard/data"),
      items: [
        {
          title: "Collections",
          url: "/dashboard/collections",
          icon: Database,
          isActive: pathname.startsWith("/dashboard/collections"),
        },
        {
          title: "Fields",
          url: "/dashboard/fields",
          icon: Settings,
          isActive: pathname.startsWith("/dashboard/fields"),
        },
        {
          title: "API Keys",
          url: "/dashboard/api-keys",
          icon: KeyRound,
          isActive: pathname.startsWith("/dashboard/api-keys"),
        },
      ],
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Core</SidebarGroupLabel>
      <SidebarMenu>
        {coreSections.map((section) => (
          <Collapsible
            key={section.title}
            asChild
            defaultOpen={section.defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={section.title}>
                  <section.icon />
                  <span>{section.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={item.isActive}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
