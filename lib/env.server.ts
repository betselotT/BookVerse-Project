import { defineEnv, z } from "nviron";

// Server-only environment variables (validated with nviron)
export const serverEnv = defineEnv({
  FIREBASE_CLIENT_EMAIL: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1), // Used in admin
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

