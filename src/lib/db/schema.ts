import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export type CaseProgressStatus = "in_progress" | "completed" | "abandoned";

export const caseProgress = pgTable(
  "case_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    caseId: text("case_id").notNull(),
    state: jsonb("state").notNull().default({}),
    status: text("status").notNull().default("in_progress").$type<CaseProgressStatus>(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("case_progress_user_case_idx").on(table.userId, table.caseId)],
);

export type CaseProgressRow = typeof caseProgress.$inferSelect;
export type CaseProgressInsert = typeof caseProgress.$inferInsert;
