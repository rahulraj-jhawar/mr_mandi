import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const laborFlowRegionsTable = pgTable("labor_flow_regions", {
  id: serial("id").primaryKey(),
  state: text("state").notNull().unique(),
  historicalOutflow: integer("historical_outflow").notNull(),
  predictedOutflow: integer("predicted_outflow").notNull(),
  demandIndex: real("demand_index").notNull(),
  supplyIndex: real("supply_index").notNull(),
  stabilityScore: real("stability_score").notNull(),
  trend: text("trend").notNull(),
  topSkills: text("top_skills").array().notNull(),
});

export const insertLaborFlowRegionSchema = createInsertSchema(laborFlowRegionsTable).omit({
  id: true,
});
export type InsertLaborFlowRegion = z.infer<typeof insertLaborFlowRegionSchema>;
export type LaborFlowRegion = typeof laborFlowRegionsTable.$inferSelect;
