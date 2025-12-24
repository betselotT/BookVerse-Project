"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Book } from "@/types/book"
import Link from "next/link"
import Image from "next/image"

interface FeaturedBooksProps {
  books: Book[]
}

export default function FeaturedBooks({ books }: FeaturedBooksProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length)
    }, 5000)

    return () => resetTimeout()
  }, [currentIndex, books.length])

  const handlePrevious = () => {
    resetTimeout()
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length)
  }

  const handleNext = () => {
    resetTimeout()
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length)
  }

  if (books.length === 0) return null

  const book = books[currentIndex]

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl mb-8">
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={book.coverUrl || "/placeholder.svg?height=600&width=1200"}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-300 mb-4">by {book.author}</p>
          <Link href={`/books/${book.id}`}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">View Details</Button>
          </Link>
        </motion.div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {books.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-orange-500" : "bg-gray-500"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}
