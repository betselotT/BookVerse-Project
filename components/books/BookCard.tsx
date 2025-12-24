"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookCardProps {
  id: string
  title: string
  author: string
  coverUrl: string
  rating: number
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export default function BookCard({
  id,
  title,
  author,
  coverUrl,
  rating,
  isFavorite = false,
  onToggleFavorite,
}: BookCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorite(!favorite)
    if (onToggleFavorite) {
      onToggleFavorite(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="book-card"
    >
      <Link href={`/books/${id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={coverUrl || "/placeholder.svg?height=450&width=300"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />

          <div className="book-card-overlay">
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <Heart
                className={cn("h-5 w-5 transition-colors", favorite ? "fill-orange-500 text-orange-500" : "text-white")}
              />
            </button>

            <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
            <p className="text-sm text-gray-300">{author}</p>

            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("h-4 w-4", i < rating ? "fill-orange-500 text-orange-500" : "text-gray-500")}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
