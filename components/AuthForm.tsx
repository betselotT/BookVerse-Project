"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import CustomFormField from "./FormField";
import PasswordField from "./password-field";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/books");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <>
      {/* Global styles to ensure full coverage */}
      <style jsx global>{`
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        body > div {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>

      {/* Main container with full viewport background */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 dark:opacity-20"></div>
      </div>

      {/* Content container */}
      <div className="relative flex items-center justify-center min-h-screen w-full px-4 py-16 z-10">
        <div className="w-full max-w-md animate-in slide-in-from-bottom duration-700">
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl transform -rotate-3"></div>

            {/* Card content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-orange-100 dark:border-gray-800">
              <div className="py-10 px-8">
                {/* Logo */}
                <div className="flex items-center justify-center group mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                    BookVerse
                  </span>
                </div>

                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                  {isSignIn ? "Welcome Back" : "Create Your Account"}
                </h3>

                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  {isSignIn
                    ? "Sign in to access your favorite books"
                    : "Join BookVerse to discover amazing stories"}
                </p>

                {/* Form */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-5 text-black dark:text-white"
                  >
                    {!isSignIn && (
                      <CustomFormField
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder="Your full name"
                        type="text"
                      />
                    )}

                    <CustomFormField
                      control={form.control}
                      name="email"
                      label="Email"
                      placeholder="Your email address"
                      type="email"
                    />

                    <PasswordField
                      control={form.control}
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSignIn ? (
                        <>
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span>Create Account</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Divider
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative px-4 bg-white text-sm text-gray-500">
                    Or continue with
                  </div>
                </div>

                {/* Social login buttons */}
                {/* <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    variant="outline"
                    className="border-orange-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
                  >
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
                  >
                    Apple
                  </Button>
                </div>  */}

                {/* Sign in/up toggle */}
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {isSignIn
                    ? "Don't have an account yet?"
                    : "Already have an account?"}
                  <Link
                    href={!isSignIn ? "/sign-in" : "/sign-up"}
                    className="ml-1 font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors duration-300"
                  >
                    {!isSignIn ? "Sign In" : "Sign Up"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
