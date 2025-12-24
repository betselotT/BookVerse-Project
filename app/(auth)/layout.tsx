import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return <div className="flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4 max-sm:py-8">{children}</div>;
};

export default AuthLayout;