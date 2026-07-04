import { pgTable, text, serial, integer, real, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { brokersTable } from "./brokers";

export const requirementsTable = pgTable("requirements", {
  id: serial("id").primaryKey(),
  builderName: text("builder_name").notNull(),
  companyName: text("company_name").notNull(),
  projectName: text("project_name").notNull(),
  siteCity: text("site_city").notNull(),
  siteState: text("site_state").notNull(),
  skillType: text("skill_type").notNull(),
  laborTier: text("labor_tier").notNull(),
  workersNeeded: integer("workers_needed").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  durationDays: integer("duration_days").notNull(),
  wagePerDay: real("wage_per_day").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  routedBrokerId: integer("routed_broker_id").references(() => brokersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRequirementSchema = createInsertSchema(requirementsTable).omit({
  id: true,
  createdAt: true,
  status: true,
  routedBrokerId: true,
});
export type InsertRequirement = z.infer<typeof insertRequirementSchema>;
export type Requirement = typeof requirementsTable.$inferSelect;
