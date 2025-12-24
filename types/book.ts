export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  genre: string[]
  rating: number
  notes?: string
  isFavorite?: boolean
  createdAt: string
  userId: string
}

export interface Review {
  id: string
  bookId: string
  userId: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    displayName?: string
    photoURL?: string
  }
}
