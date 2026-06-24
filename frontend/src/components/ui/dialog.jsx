import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext(null)

function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const contextValue = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange])

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogPortal({ children }) {
  const context = React.useContext(DialogContext)
  if (!context?.open) return null
  return createPortal(children, document.body)
}

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  return (
    <div
      ref={ref}
      onClick={() => context?.onOpenChange?.(false)}
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-xs transition-all duration-200 animate-in fade-in-0",
        className
      )}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        context?.onOpenChange?.(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [context])

  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-lg bg-card rounded-2xl border border-border shadow-soft-xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200 my-8 max-h-[90vh]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogClose = React.forwardRef(({ className, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context?.onOpenChange?.(false)}
      className={cn(
        "absolute right-4 top-4 rounded-full opacity-70 hover:opacity-100 hover:bg-muted p-1.5 transition-all text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  )
})
DialogClose.displayName = "DialogClose"

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 px-6 py-4 border-b border-border/80 shrink-0 text-left", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-end gap-2 px-6 py-4 bg-muted/20 border-t border-border mt-auto shrink-0",
      className
    )}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, level = 3, ...props }, ref) => {
  const Comp = `h${level}`
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-base font-headline font-bold text-foreground",
        className
      )}
      {...props}
    />
  )
})
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs font-sans text-muted-foreground mt-0.5", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
