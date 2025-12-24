"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Rating from "@/components/ui/rating"
import type { Review } from "@/types/book"

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <div className="text-center py-8 text-gray-400">No reviews yet. Be the first to review this book!</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-gray-900 rounded-lg"
        >
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.user.photoURL || undefined} />
              <AvatarFallback>{review.user.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{review.user.displayName || "Anonymous"}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Rating value={review.rating} readOnly size="sm" />
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {review.comment && <p className="mt-3 text-gray-300">{review.comment}</p>}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
