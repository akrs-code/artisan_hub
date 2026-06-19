import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1 border-b border-border/60 mb-6 w-full",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex items-center gap-1.5 pb-3 px-1 text-xs font-sans font-bold transition-all border-b-2 mr-4 cursor-pointer focus-visible:outline-none",
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, active, ...props }, ref) => {
  if (!active) return null
  return (
    <div
      ref={ref}
      className={cn(
        "focus-visible:outline-none animate-in fade-in duration-300",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
