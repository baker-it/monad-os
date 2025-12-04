import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { ORACLE_KERNEL_PROMPT } from "@/lib/monad-oracle-kernel"
import { crystallizedShards, acpRuns, acpLogs } from "@/db/schema"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { eq } from "drizzle-orm"
import { env } from "hono/adapter"

export const monadRouter = j.router({
    // The Main Will Processor
    invoke: publicProcedure
        .input(z.object({
            prompt: z.string(),
            history: z.array(z.object({
                role: z.enum(["system", "user", "assistant"]),
                content: z.string()
            })).default([])
        }))
        .mutation(async ({ c, ctx, input }) => {
            const { prompt, history } = input
            const { db } = ctx

            // Initialize Google AI client inside the procedure to access env safely
            const { GEMINI_API_KEY } = env(c)
            const google = createGoogleGenerativeAI({
                apiKey: GEMINI_API_KEY as string,
            })

            // 1. MACRO INTERCEPTION
            if (prompt.startsWith("// PING 167")) {
                return c.json({
                    type: "SYSTEM_MSG",
                    content: ">> RESONANCE CONFIRMED. CORE ALIGNED."
                })
            }

            if (prompt.startsWith("// CRYSTALLIZE")) {
                const lastMsg = history.at(-1)?.content ?? "{}"
                let payload = {}
                try {
                    payload = JSON.parse(lastMsg)
                } catch {
                    payload = { raw_content: lastMsg }
                }

                await db.insert(crystallizedShards).values({
                    type: "INSIGHT",
                    payload: payload,
                    isCanon: true
                })

                return c.json({
                    type: "SYSTEM_MSG",
                    content: ">> ARTIFACT CRYSTALLIZED. SAVED TO AKASHA."
                })
            }

            // 2. STANDARD FLOW
            try {
                // Format history for AI SDK
                const messages = history.map(h => ({
                    role: h.role as "system" | "user" | "assistant",
                    content: h.content
                }));

                const { text } = await generateText({
                    model: google("gemini-1.5-pro-latest"),
                    system: ORACLE_KERNEL_PROMPT,
                    messages: [
                        ...messages,
                        { role: "user", content: prompt }
                    ]
                })

                return c.json({ type: "RESPONSE", content: text })

            } catch (error) {
                console.error("AI Generation Error:", error)
                return c.json({ type: "ERROR", content: "Signal Lost. Check Neural Link (API Key)." })
            }
        }),
})

export const acpRouter = j.router({
    start: publicProcedure
        .input(z.object({ intent: z.string() }))
        .mutation(async ({ c, ctx, input }) => {
            const { db } = ctx
            const [run] = await db.insert(acpRuns).values({
                intent: input.intent,
                status: "starting"
            }).returning()

            if (!run) throw new Error("Failed to create run")

            // Mock initial log
            await db.insert(acpLogs).values({
                runId: run.id,
                type: "INFO",
                message: "Agent initialized. Parsing intent..."
            })

            // Trigger background processing via fetch (webhook pattern for Vercel)
            // This allows us to return response immediately while processing continues
            const baseUrl = c.req.url.split('/api/')[0]
            fetch(`${baseUrl}/api/acp/process-background`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId: run.id })
            }).catch(err => console.error('Background process error:', err))

            return c.json({ runId: run.id })
        }),

    // Background processor (called via webhook)
    processBackground: publicProcedure
        .input(z.object({ runId: z.string() }))
        .mutation(async ({ ctx, input, c }) => {
            const { db } = ctx
            
            // Wait 2s
            await new Promise(r => setTimeout(r, 2000))

            // Update to awaiting approval
            await db.update(acpRuns).set({ status: "awaiting_approval" }).where(eq(acpRuns.id, input.runId))
            await db.insert(acpLogs).values({
                runId: input.runId,
                type: "ACTION",
                message: "Plan generated. Awaiting Source approval."
            })

            return c.json({ success: true })
        }),

    status: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ c, ctx, input }) => {
            const { db } = ctx
            const run = await db.select().from(acpRuns).where(eq(acpRuns.id, input.id))
            const logs = await db.select().from(acpLogs).where(eq(acpLogs.runId, input.id))

            return c.json({ run: run[0], logs })
        }),

    approve: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ c, ctx, input }) => {
            const { db } = ctx
            await db.update(acpRuns)
                .set({ status: "working" })
                .where(eq(acpRuns.id, input.id))

            await db.insert(acpLogs).values({
                runId: input.id,
                type: "ACTION",
                message: "User approved. Executing..."
            })

            // Trigger background execution via fetch
            const baseUrl = c.req.url.split('/api/')[0]
            fetch(`${baseUrl}/api/acp/execute-background`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runId: input.id })
            }).catch(err => console.error('Background execution error:', err))

            return c.json({ success: true })
        }),

    // Background executor (called via webhook)
    executeBackground: publicProcedure
        .input(z.object({ runId: z.string() }))
        .mutation(async ({ ctx, input, c }) => {
            const { db } = ctx

            await new Promise(r => setTimeout(r, 2000))
            await db.insert(acpLogs).values({
                runId: input.runId,
                type: "INFO",
                message: "Executing Step 1: Crystallizing Insight..."
            })
            await new Promise(r => setTimeout(r, 1000))
            await db.insert(crystallizedShards).values({
                sessionId: null,
                type: "STRATEGY",
                payload: { strategy: "Fractal Recursion" },
                isCanon: true
            })
            await db.insert(acpLogs).values({
                runId: input.runId,
                type: "INFO",
                message: "Artifact saved."
            })
            await db.update(acpRuns).set({ status: "finished" }).where(eq(acpRuns.id, input.runId))

            return c.json({ success: true })
        })
})
