import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest block mb-1.5",
        className
      )}
      {...props}
    />
  )
})
Label.displayName = "Label"

export { Label }
