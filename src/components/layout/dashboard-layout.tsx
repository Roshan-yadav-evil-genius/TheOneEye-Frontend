"use client"

import { useUIStore } from "@/stores/ui-store"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const setPageTitle = useUIStore((state) => state.setPageTitle)

  useEffect(() => {
    if (title) {
      setPageTitle(title)
    }
  }, [title, setPageTitle])

  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-4">
        {title && (
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
        )}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
