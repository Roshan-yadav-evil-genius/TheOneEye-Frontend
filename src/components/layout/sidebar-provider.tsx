"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useUIStore } from "@/stores/ui-store"

interface SidebarProviderWrapperProps {
  children: React.ReactNode
}

export function SidebarProviderWrapper({ children }: SidebarProviderWrapperProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, hasHydrated } = useUIStore()
  
  // Check if we're on a dashboard page (pages that should have sidebar)
  const isWorkflowEditor = pathname.match(/^\/workflow\/[^\/]+$/)
  const isDashboardPage = pathname.startsWith('/dashboard') || 
                         pathname.startsWith('/workflow') || 
                         pathname.startsWith('/nodes') ||
                         pathname.startsWith('/browser-sessions')

  if (!isDashboardPage) {
    // For non-dashboard pages, just render children without sidebar
    return <>{children}</>
  }

  // Show loading state during hydration to prevent flash
  if (!hasHydrated) {
    return (
      <div className="flex h-screen">
        <div className="w-72 bg-sidebar border-r border-border" />
        <div className="flex-1">
          <div className="h-12 border-b border-border" />
          <div className="flex flex-col gap-4 md:gap-6">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset data-workflow-editor={isWorkflowEditor ? "true" : "false"} className="m-16" >
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {isWorkflowEditor ? (
              // For workflow editor, no padding and no gap - full screen layout
              <div className="flex flex-col h-full">
                {children}
              </div>
            ) : (
              // For other dashboard pages, keep the padding
              <div className="flex flex-col gap-4 md:gap-6">
                {children}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
