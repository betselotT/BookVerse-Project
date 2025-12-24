"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface BookFilterProps {
  genres: string[]
  onFilterChange: (filters: {
    genre?: string
    rating?: number
    sortBy?: string
  }) => void
}

export default function BookFilter({ genres, onFilterChange }: BookFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    genre: "",
    rating: 0,
    sortBy: "newest",
  })

  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetValues = {
      genre: "",
      rating: 0,
      sortBy: "newest",
    }
    setFilters(resetValues)
    onFilterChange(resetValues)
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Library</h2>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-900 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs text-gray-400 hover:text-white"
                >
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Genre</label>
                  <Select value={filters.genre} onValueChange={(value) => handleFilterChange("genre", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Minimum Rating: {filters.rating}</label>
                  <Slider
                    value={[filters.rating]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleFilterChange("rating", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="rating-high">Highest Rating</SelectItem>
                      <SelectItem value="rating-low">Lowest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
