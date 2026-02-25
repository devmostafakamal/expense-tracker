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

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  budgetId: integer("budget_id").references(() => budgets.id), // 🔹 new
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  targetAmount: integer("target_amount").notNull(),
  savedAmount: integer("saved_amount").notNull().default(0),
  currency: text("currency").notNull().default("BDT"),
  deadline: text("deadline"),
  category: text("category").default("General"),
  createdAt: timestamp("created_at").defaultNow(),
});
