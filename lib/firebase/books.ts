import { db } from "@/firebase/client"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { getCurrentUser } from "@/lib/actions/auth.action"

// Book reading status types
export type ReadingStatus = "want-to-read" | "reading" | "completed"

// Book interface
export interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: ReadingStatus
  progress: number
  rating?: number
  dateAdded: string
  categories?: string[]
  pageCount?: number
  userId: string
}

// Get current user ID using your auth system
const getCurrentUserId = async () => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }
  return user.id
}

// Add a new book
export const addBook = async (bookData: Omit<Book, "id" | "dateAdded" | "userId">) => {
  try {
    const userId = await getCurrentUserId()
    const booksRef = collection(db, "books")

    const newBook = {
      ...bookData,
      userId,
      dateAdded: serverTimestamp(),
    }

    const docRef = await addDoc(booksRef, newBook)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding book:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Get all books for current user
export const getUserBooks = async () => {
  try {
    const userId = await getCurrentUserId()
    const booksRef = collection(db, "books")
    const q = query(booksRef, where("userId", "==", userId), orderBy("dateAdded", "desc"))

    const querySnapshot = await getDocs(q)
    const books: Book[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      books.push({
        id: doc.id,
        ...data,
        dateAdded: data.dateAdded?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Book)
    })

    return { success: true, books }
  } catch (error) {
    console.error("Error fetching books:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error", books: [] }
  }
}

// Update book status
export const updateBookStatus = async (bookId: string, status: ReadingStatus) => {
  try {
    const userId = await getCurrentUserId()
    const bookRef = doc(db, "books", bookId)

    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    }

    // Auto-update progress based on status
    if (status === "completed") {
      updateData.progress = 100
    } else if (status === "want-to-read") {
      updateData.progress = 0
    }

    await updateDoc(bookRef, updateData)
    return { success: true }
  } catch (error) {
    console.error("Error updating book status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Update book progress
export const updateBookProgress = async (bookId: string, progress: number) => {
  try {
    const userId = await getCurrentUserId()
    const bookRef = doc(db, "books", bookId)

    const updateData: any = {
      progress,
      updatedAt: serverTimestamp(),
    }

    // Auto-update status based on progress
    if (progress === 100) {
      updateData.status = "completed"
    } else if (progress > 0) {
      updateData.status = "reading"
    }
// ⚠️ Important: This ensures the book's reading status reflects actual progress
    await updateDoc(bookRef, updateData)
    return { success: true }
  } catch (error) {
    console.error("Error updating book progress:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Update book rating
export const updateBookRating = async (bookId: string, rating: number) => {
  try {
    const userId = await getCurrentUserId()
    const bookRef = doc(db, "books", bookId)

    await updateDoc(bookRef, {
      rating,
      updatedAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating book rating:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Delete a book
export const deleteBook = async (bookId: string) => {
  try {
    const userId = await getCurrentUserId()
    const bookRef = doc(db, "books", bookId)

    await deleteDoc(bookRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting book:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Update book details
export const updateBookDetails = async (bookId: string, updates: Partial<Book>) => {
  try {
    const userId = await getCurrentUserId()
    const bookRef = doc(db, "books", bookId)

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    // Remove fields that shouldn't be updated
    delete updateData.id
    delete updateData.userId
    delete updateData.dateAdded

    await updateDoc(bookRef, updateData)
    return { success: true }
  } catch (error) {
    console.error("Error updating book details:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
