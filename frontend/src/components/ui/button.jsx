import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark",
        outline: "border border-border/80 text-muted-foreground bg-transparent hover:bg-neutral-light hover:text-foreground",
        secondary: "bg-secondary text-white hover:bg-secondary-dark",
        ghost: "hover:bg-muted hover:text-foreground text-muted-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive-hover",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "py-3 px-5 text-xs rounded-xl gap-1.5",
        sm: "py-2 px-3 text-[10px] rounded-lg gap-1",
        lg: "py-4 px-6 text-sm rounded-xl gap-2",
        icon: "size-10 rounded-xl",
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
