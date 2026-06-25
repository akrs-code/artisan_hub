import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 [&>svg~div]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border [&>svg]:text-foreground",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive [&>svg]:text-destructive",
        warning:
          "border-primary/20 bg-primary/5 text-primary-dark [&>svg]:text-primary-dark",
        success:
          "border-green-600/20 bg-green-50 text-green-800 [&>svg]:text-green-800",
        info:
          "border-blue-600/20 bg-blue-50 text-blue-800 [&>svg]:text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-sans font-bold text-xs leading-none text-foreground", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs font-sans opacity-80 leading-relaxed text-muted-foreground", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
