import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background text-foreground hover:bg-muted",
        secondary: "bg-accent text-accent-foreground hover:bg-accent/90",
        ghost: "hover:bg-muted hover:text-foreground text-muted-foreground",
        destructive: "bg-primary text-primary-foreground hover:bg-primary/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "py-2.5 px-5 text-sm rounded-[8px] gap-2",
        sm: "py-2 px-4 text-xs rounded-[8px] gap-1.5",
        lg: "py-3 px-6 text-sm rounded-[8px] gap-2",
        icon: "size-10 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
