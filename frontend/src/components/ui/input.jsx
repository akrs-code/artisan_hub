import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full px-4 py-2.5 bg-background border border-border rounded-[8px] text-sm font-sans placeholder:text-muted-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
