import { serial, integer, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // which user created budget
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
