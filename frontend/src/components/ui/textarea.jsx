import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full px-3.5 py-2.5 bg-card border border-border/70 rounded-xl text-sm font-sans placeholder:text-muted-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
