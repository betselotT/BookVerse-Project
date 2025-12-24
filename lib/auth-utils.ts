"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "./actions/auth.action"

// Hook to check authentication status and handle navigation
export const useAuthNavigation = () => {
  const router = useRouter()

  const navigateToMyBooks = async () => {
    try {
      const user = await isAuthenticated()

      if (user) {
        // User is logged in, redirect to books page
        router.push("/books")
        toast.success("Welcome to your reading dashboard!")
      } else {
        // User is not logged in, show toast and redirect to sign-in
        toast.error("Please sign in to access your books", {
          description: "You need to be logged in to view your reading list",
          action: {
            label: "Sign In",
            onClick: () => router.push("/sign-in"),
          },
        })
      }
    } catch (error) {
      console.error("Authentication check failed:", error)
      toast.error("Authentication check failed. Please try again.")
    }
  }

  const checkIsLoggedIn = async () => {
    try {
      return await isAuthenticated()
    } catch (error) {
      console.error("Authentication check failed:", error)
      return false
    }
  }

  return { navigateToMyBooks, checkIsLoggedIn }
}

// Alternative function-based approach (if you prefer not to use hooks)
export const checkAuthAndNavigate = async (router: any) => {
  try {
    const user = await isAuthenticated()

    if (user) {
      // User is logged in, redirect to books page
      router.push("/books")
      toast.success("Welcome to your reading dashboard!")
    } else {
      // User is not logged in, show toast and redirect to sign-in
      toast.error("Please sign in to access your books", {
        description: "You need to be logged in to view your reading list",
        action: {
          label: "Sign In",
          onClick: () => router.push("/sign-in"),
        },
      })
    }
  } catch (error) {
    console.error("Authentication check failed:", error)
    toast.error("Authentication check failed. Please try again.")
  }
}
