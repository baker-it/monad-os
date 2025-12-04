import type { AppRouter } from "@/server"
import { createClient } from "jstack"

export const client = createClient<AppRouter>({
  baseUrl: getBaseUrl(),
})

function getBaseUrl() {
  // In production (Vercel), point to the Cloudflare Worker
  if (process.env.NODE_ENV === "production") {
    return "https://jstack-app.skrytyjumper.workers.dev/api"
  }

  // Locally, use localhost
  return "http://localhost:3000/api"
}
