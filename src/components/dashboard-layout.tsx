"use client"

import { usePageTitle } from "@/contexts/page-title-context"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    if (title) {
      setTitle(title)
    }
  }, [title, setTitle])

  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title || "Dashboard"}</h1>
        </div>
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
