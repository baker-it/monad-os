import { pgTable, text, jsonb, timestamp, boolean, uuid, serial } from "drizzle-orm/pg-core";

// 1. MONAD SESSIONS (Input Stream)
export const monadSessions = pgTable("monad_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  intention: text("intention").notNull(),
  resonanceScore: text("resonance_score"), // 33, 38, 47
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. CRYSTALLIZED SHARDS (Artifacts)
export const crystallizedShards = pgTable("crystallized_shards", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => monadSessions.id),
  type: text("type").notNull(), // "INSIGHT", "STRATEGY", "CODE"
  payload: jsonb("payload").notNull(),
  isCanon: boolean("is_canon").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. VECTORS (Memory)
export const vectors = pgTable("vectors", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content"),
  embedding: jsonb("embedding"), // Placeholder for vector type
});

// 4. ACP RUNS (Agent Client Protocol)
export const acpRuns = pgTable("acp_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  intent: text("intent").notNull(),
  status: text("status").notNull().default('starting'), // 'starting'|'working'|'awaiting_approval'|'finished'
  resultPayload: jsonb("result_payload"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 5. ACP LOGS
export const acpLogs = pgTable("acp_logs", {
  id: serial("id").primaryKey(),
  runId: uuid("run_id").references(() => acpRuns.id),
  type: text("type").notNull(), // 'INFO', 'ERROR', 'ACTION'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

