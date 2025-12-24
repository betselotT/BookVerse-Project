"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Rating({ value, onChange, readOnly = false, size = "md" }: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverValue(index + 1)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null)
    }
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const isActive = hoverValue !== null ? index < hoverValue : index < value

        return (
          <motion.button
            key={index}
            type="button"
            whileTap={{ scale: readOnly ? 1 : 0.8 }}
            className={cn("focus:outline-none transition-colors", readOnly ? "cursor-default" : "cursor-pointer")}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
          >
            <Star
              className={cn(
                sizes[size],
                isActive ? "fill-orange-500 text-orange-500" : "text-gray-500",
                !readOnly && "hover:text-orange-400",
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
