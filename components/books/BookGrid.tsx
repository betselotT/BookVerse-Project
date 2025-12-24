"use client"
import { motion } from "framer-motion"
import BookCard from "./BookCard"
import type { Book } from "@/types/book"

interface BookGridProps {
  books: Book[]
  onToggleFavorite?: (id: string) => void
}

export default function BookGrid({ books, onToggleFavorite }: BookGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
    >
      {books.map((book) => (
        <motion.div key={book.id} variants={item}>
          <BookCard
            id={book.id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            rating={book.rating}
            isFavorite={book.isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
