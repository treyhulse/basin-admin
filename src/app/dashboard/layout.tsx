'use client';

import AuthGuard from '@/components/auth/auth-guard';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen w-full max-w-full overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <SiteHeader />
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-full min-w-0 overflow-hidden">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
