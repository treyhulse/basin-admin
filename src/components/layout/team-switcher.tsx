"use client"

import * as React from "react"
import { ChevronsUpDown, Building2, Plus, Loader2, Check } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { useTenantManagement } from "@/hooks/use-tenant-management"
import { TenantCreationDialog } from "@/components/tenant/tenant-creation-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { tenant } = useAuth()
  const { tenants, isLoading, isSwitching, switchToTenant, fetchTenants } = useTenantManagement()
  
  if (!tenant) {
    return null
  }

  const handleTenantSwitch = async (tenantId: string) => {
    if (tenantId === tenant.id) return; // Already on this tenant
    await switchToTenant(tenantId);
  };

  const handleTenantCreated = () => {
    fetchTenants(); // Refresh the list
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{tenant.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            
            {/* Current Organization */}
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Building2 className="size-3.5 shrink-0" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{tenant.name}</span>
                <span className="text-xs text-muted-foreground">{tenant.slug}</span>
              </div>
              <DropdownMenuShortcut>Current</DropdownMenuShortcut>
            </DropdownMenuItem>
            
            {/* Other Organizations */}
            {tenants.length > 1 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Switch Organization
                </DropdownMenuLabel>
                {tenants
                  .filter(t => t.id !== tenant.id)
                  .map((otherTenant) => (
                    <DropdownMenuItem
                      key={otherTenant.id}
                      className="gap-2 p-2"
                      onClick={() => handleTenantSwitch(otherTenant.id)}
                      disabled={isSwitching}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <Building2 className="size-3.5 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{otherTenant.name}</span>
                        <span className="text-xs text-muted-foreground">{otherTenant.slug}</span>
                      </div>
                      {isSwitching && (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                      )}
                    </DropdownMenuItem>
                  ))}
              </>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Create New Organization */}
            <TenantCreationDialog onSuccess={handleTenantCreated}>
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Create Organization</div>
              </DropdownMenuItem>
            </TenantCreationDialog>
            
            {/* Loading State */}
            {isLoading && (
              <DropdownMenuItem disabled className="gap-2 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Loading organizations...</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
