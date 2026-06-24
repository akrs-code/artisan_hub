import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const StarRating = React.forwardRef(({
  className,
  rating = 0,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  ...props
}, ref) => {
  const [hoverRating, setHoverRating] = React.useState(null)
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  }

  const starSize = sizeClasses[size] || size

  const currentRating = hoverRating !== null ? hoverRating : rating

  const handleStarClick = (idx) => {
    if (interactive && onRatingChange) {
      onRatingChange(idx + 1)
    }
  }

  const handleMouseEnter = (idx) => {
    if (interactive) {
      setHoverRating(idx + 1)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null)
    }
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <div className="flex gap-0.5" onMouseLeave={handleMouseLeave}>
        {[...Array(maxStars)].map((_, i) => {
          const filled = i < currentRating
          return (
            <Star
              key={i}
              onClick={() => handleStarClick(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              className={cn(
                starSize,
                filled ? "fill-primary text-primary" : "text-muted/30",
                interactive && "cursor-pointer transition-transform duration-100 hover:scale-110"
              )}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-[10px] font-sans font-bold text-foreground ml-1">
          {rating ? Number(rating).toFixed(1) : "—"}
        </span>
      )}
    </div>
  )
})
StarRating.displayName = "StarRating"

export { StarRating }
