import appRouter from "@/server"
import { handle } from "hono/vercel"

// Use Edge Runtime for better async handling (similar to Cloudflare Workers)
export const runtime = 'edge'

// This route catches all incoming API requests and lets your appRouter handle them.
export const GET = handle(appRouter.handler)
export const POST = handle(appRouter.handler)
