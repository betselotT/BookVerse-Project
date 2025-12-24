"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      router.push("/sign-in");
    });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex items-center gap-2 text-primary-100 cursor-pointer"
    >
      <span>{isPending ? "Signing out..." : <LogOut size={40} />}</span>
    </button>
  );
};

export default SignOutButton;