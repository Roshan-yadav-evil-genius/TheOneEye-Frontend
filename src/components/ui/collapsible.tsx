"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

interface CollapsibleProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  asChild?: boolean
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, open, onOpenChange, asChild, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    
    const isOpen = open !== undefined ? open : internalOpen
    const handleOpenChange = onOpenChange || setInternalOpen

    const contextValue = React.useMemo(
      () => ({
        open: isOpen,
        onOpenChange: handleOpenChange,
      }),
      [isOpen, handleOpenChange]
    )

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

import { Slot } from "@radix-ui/react-slot"

// ...

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild = false, className, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleTrigger must be used within a Collapsible")
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      context.onOpenChange(!context.open)
      onClick?.(event)
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleContent must be used within a Collapsible")
    }

    if (!context.open) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
