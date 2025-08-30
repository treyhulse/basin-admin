"use client"

import * as React from "react"
import {
  Database,
  Frame,
  Map,
  PieChart,
  Settings2,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation data for the sidebar
const data = {
  navMain: [
    {
      title: "Data Management",
      url: "/dashboard",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "Collections",
          url: "/dashboard/collections",
        },
        {
          title: "Data Views",
          url: "/dashboard/data-views",
        },
        {
          title: "API Keys",
          url: "/dashboard/api-keys",
        },
      ],
    },
    {
      title: "Administration",
      url: "/dashboard",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/roles",
        },
        {
          title: "Organization",
          url: "/dashboard/organization",
        },
      ],
    },
    {
      title: "System",
      url: "/dashboard",
      icon: Settings2,
      items: [
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Production",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Development",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      name: "Staging",
      url: "/dashboard",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
