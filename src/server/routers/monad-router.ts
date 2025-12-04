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
                return c.superjson({
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

                return c.superjson({
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

                return c.superjson({ type: "RESPONSE", content: text })

            } catch (error) {
                console.error("AI Generation Error:", error)
                return c.superjson({ type: "ERROR", content: "Signal Lost. Check Neural Link (API Key)." })
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

                // SIMULATE AGENT LOOP (Async)
                // We don't await this promise to allow immediate return to client
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                ; (async () => {
                    // Wait 2s
                    await new Promise(r => setTimeout(r, 2000))

                    // Update to awaiting approval
                    await db.update(acpRuns).set({ status: "awaiting_approval" }).where(eq(acpRuns.id, run.id))
                    await db.insert(acpLogs).values({
                        runId: run.id,
                        type: "ACTION",
                        message: "Plan generated. Awaiting Source approval."
                    })
                })()

            return c.superjson({ runId: run.id })
        }),

    status: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ c, ctx, input }) => {
            const { db } = ctx
            const run = await db.select().from(acpRuns).where(eq(acpRuns.id, input.id))
            const logs = await db.select().from(acpLogs).where(eq(acpLogs.runId, input.id))

            return c.superjson({ run: run[0], logs })
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

                // SIMULATE EXECUTION
                // We don't await this promise to allow immediate return to client
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                ; (async () => {
                    await new Promise(r => setTimeout(r, 2000))
                    await db.insert(acpLogs).values({
                        runId: input.id,
                        type: "INFO",
                        message: "Executing Step 1: Crystallizing Insight..."
                    })
                    await new Promise(r => setTimeout(r, 1000))
                    await db.insert(crystallizedShards).values({
                        sessionId: null, // Optional
                        type: "STRATEGY",
                        payload: { strategy: "Fractal Recursion" },
                        isCanon: true
                    })
                    await db.insert(acpLogs).values({
                        runId: input.id,
                        type: "INFO",
                        message: "Artifact saved."
                    })
                    await db.update(acpRuns).set({ status: "finished" }).where(eq(acpRuns.id, input.id))
                })()

            return c.superjson({ success: true })
        })
})
