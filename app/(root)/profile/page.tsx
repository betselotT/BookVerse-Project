"use client";

import { BookOpen, User, Edit, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type * as React from "react";
import { useState, useEffect } from "react";
import SignOutButton from "@/components/sign-out-button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserBooks } from "@/lib/firebase/books";
import { toast } from "sonner";

// User interface
interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  joinDate: string;
}

// Profile stats interface
interface ProfileStats {
  booksRead: number;
  currentlyReading: number;
  wantToRead: number;
  memberSince: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0,
    memberSince: "2024",
  });
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");

  // Load user profile and stats
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);

        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          router.push("/sign-in");
          return;
        }

        // Set profile data
        const userProfile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          bio:
            user.bio ||
            "Passionate reader who loves exploring different genres.",
          joinDate: user.joinDate || new Date().toISOString(),
        };
        setProfile(userProfile);
        setEditedBio(userProfile.bio || "");

        // Get user's books for stats
        const booksResult = await getUserBooks();
        if (booksResult.success) {
          const books = booksResult.books;
          const completedBooks = books.filter(
            (book) => book.status === "completed"
          ).length;
          const currentlyReadingBooks = books.filter(
            (book) => book.status === "reading"
          ).length;
          const wantToReadBooks = books.filter(
            (book) => book.status === "want-to-read"
          ).length;

          setStats({
            booksRead: completedBooks,
            currentlyReading: currentlyReadingBooks,
            wantToRead: wantToReadBooks,
            memberSince: new Date(userProfile.joinDate)
              .getFullYear()
              .toString(),
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  // Handle bio editing
  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    try {
      // In a real app, you would save this to your user database
      // For now, we'll just update the local state
      if (profile) {
        setProfile({ ...profile, bio: editedBio });
        setIsEditingBio(false);
        toast.success("Bio updated successfully!");
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      toast.error("Failed to update bio");
    }
  };

  const handleCancelEdit = () => {
    setEditedBio(profile?.bio || "");
    setIsEditingBio(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Button onClick={() => router.push("/sign-in")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 text-orange-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-20 w-full border-b bg-white/95 backdrop-blur-md shadow-sm animate-in slide-in-from-top duration-300 pr-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center group cursor-pointer pl-10"
              onClick={() => router.push("/")}
            >
              <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                BookVerse
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => router.push("/")}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => router.push("/books")}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-300 hover:scale-105 relative group"
            >
              My Books
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="text-sm font-medium text-orange-600 relative group cursor-default">
              Profile
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 transition-all duration-300"></span>
            </button>
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => {
                  router.push("/profile");
                  console.log("Profile clicked");
                }}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition cursor-pointer"
              >
                <User className="h-9 w-9 text-gray-700 hover:text-orange-500 transition-all duration-300 hover:scale-105 relative group" />
              </button>
              <div className="text-gray-700 hover:text-orange-500 transition-all duration-300 hover:scale-105">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Main Content */}
      <main className="relative z-10 flex flex-col items-center py-12 px-4 md:px-0 max-w-2xl mx-auto">
        <div className="w-32 h-32 rounded-full border-4 border-orange-200 overflow-hidden shadow-lg mb-4">
          <img
            src="/placeholder.svg?height=128&width=128"
            alt={profile.name}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>

        {/* Bio Section */}
        <div className="w-full max-w-md mb-4">
          {isEditingBio ? (
            <div className="space-y-3">
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full text-center border-orange-200 focus:border-orange-400 resize-none"
                rows={3}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-center gap-2">
                <Button
                  onClick={handleSaveBio}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-orange-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-orange-700 text-lg mb-2">{profile.bio}</p>
              <Button
                onClick={handleEditBio}
                size="sm"
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Bio
              </Button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-6 bg-white/90 border border-orange-100 rounded-lg px-8 py-4 shadow mt-2 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-600">
              {stats.booksRead}
            </span>
            <span className="text-sm text-gray-500">Books Read</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-600">
              {stats.currentlyReading}
            </span>
            <span className="text-sm text-gray-500">Currently Reading</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-600">
              {stats.wantToRead}
            </span>
            <span className="text-sm text-gray-500">Want to Read</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-600">
              {stats.memberSince}
            </span>
            <span className="text-sm text-gray-500">Member Since</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
