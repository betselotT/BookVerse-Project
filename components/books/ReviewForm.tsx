"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@/components/ui/rating";

interface ReviewFormProps {
  bookId: string;
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
}

export default function ReviewForm({ bookId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please provide a rating before submitting your review.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment("");
      toast.success("Your review has been successfully submitted.");
    } catch (error) {
      toast.error("Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-900 p-4 rounded-lg"
    >
      <h3 className="text-lg font-medium">Write a Review</h3>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Your Rating</label>
        <Rating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm text-gray-400">
          Your Review (optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this book..."
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-black"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </motion.form>
  );
}
