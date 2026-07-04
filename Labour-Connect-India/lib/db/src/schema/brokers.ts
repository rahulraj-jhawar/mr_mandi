import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const brokersTable = pgTable("brokers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  agencyName: text("agency_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  skillsCovered: text("skills_covered").array().notNull(),
  laborPoolSize: integer("labor_pool_size").notNull(),
  availableCapacity: integer("available_capacity").notNull(),
  rating: real("rating").notNull().default(4.5),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBrokerSchema = createInsertSchema(brokersTable).omit({
  id: true,
  createdAt: true,
  rating: true,
  verified: true,
});
export type InsertBroker = z.infer<typeof insertBrokerSchema>;
export type Broker = typeof brokersTable.$inferSelect;
