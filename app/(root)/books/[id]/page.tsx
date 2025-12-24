"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Rating from "@/components/ui/rating"
import ReviewForm from "@/components/books/ReviewForm"
import ReviewList from "@/components/books/ReviewList"
import type { Book, Review } from "@/types/book"
import { getBookById, getBookReviews, addReview, toggleFavorite } from "@/lib/firebase"
import { ArrowLeft, Heart, Pencil } from "lucide-react"

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData, reviewsData] = await Promise.all([getBookById(params.id), getBookReviews(params.id)])

        setBook(bookData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching book details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleToggleFavorite = async () => {
    if (!book) return

    try {
      await toggleFavorite(book.id, !book.isFavorite)
      setBook({ ...book, isFavorite: !book.isFavorite })
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleAddReview = async (reviewData: { rating: number; comment: string }) => {
    if (!book) return

    try {
      const newReview = await addReview({
        bookId: book.id,
        userId: "user1",
        rating: reviewData.rating,
        comment: reviewData.comment,
      })

      setReviews([newReview, ...reviews])
    } catch (error) {
      console.error("Error adding review:", error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Book not found.</p>
        <Button variant="link" onClick={() => router.push("/books")} className="mt-4">
          Back to Books
        </Button>
      </div>
    )
  }

  return (
    <div className="md:ml-64">
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-4">
            <Image
              src={book.coverUrl || "/placeholder.svg?height=450&width=300"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between items-center">
            <Rating value={book.rating} readOnly size="md" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              className={`rounded-full ${book.isFavorite ? "bg-orange-500/10" : ""}`}
            >
              <Heart className={`h-5 w-5 ${book.isFavorite ? "fill-orange-500 text-orange-500" : ""}`} />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-400">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {book.genre.map((g) => (
              <span key={g} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                {g}
              </span>
            ))}
          </div>

          {book.notes && (
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Pencil className="h-4 w-4 mr-2 text-orange-500" />
                Your Notes
              </h3>
              <p className="text-gray-300">{book.notes}</p>
            </div>
          )}

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="add-review">Add Review</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="pt-4">
              <ReviewList reviews={reviews} />
            </TabsContent>
            <TabsContent value="add-review" className="pt-4">
              <ReviewForm bookId={book.id} onSubmit={handleAddReview} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
