ALTER TABLE "budgets" ADD COLUMN "category" text DEFAULT 'Other' NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "category" text DEFAULT 'Other' NOT NULL;