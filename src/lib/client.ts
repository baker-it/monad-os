import type { AppRouter } from "@/server"
import { createClient } from "jstack"

export const client = createClient<AppRouter>({
  baseUrl: getBaseUrl(),
})

function getBaseUrl() {
  // In browser (client-side), use relative URL to hit Vercel's own API routes
  if (typeof window !== 'undefined') {
    return "/api"
  }

  // Server-side (SSR/SSG), use localhost in dev or relative in production
  if (process.env.NODE_ENV === "production") {
    return "/api"
  }

  return "http://localhost:3000/api"
}
