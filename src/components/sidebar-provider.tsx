"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

interface SidebarProviderWrapperProps {
  children: React.ReactNode
}

export function SidebarProviderWrapper({ children }: SidebarProviderWrapperProps) {
  const pathname = usePathname()
  
  // Check if we're on a dashboard page (pages that should have sidebar)
  const isDashboardPage = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/workflow') || 
                         pathname.startsWith('/settings') || 
                         pathname.startsWith('/analytics') || 
                         pathname.startsWith('/projects') || 
                         pathname.startsWith('/proposal') || 
                         pathname.startsWith('/search') || 
                         pathname.startsWith('/capture') || 
                         pathname.startsWith('/prompts') || 
                         pathname.startsWith('/team') || 
                         pathname.startsWith('/help') || 
                         pathname.startsWith('/data-library') || 
                         pathname.startsWith('/word-assistant') || 
                         pathname.startsWith('/reports')

  if (!isDashboardPage) {
    // For non-dashboard pages, just render children without sidebar
    return <>{children}</>
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
