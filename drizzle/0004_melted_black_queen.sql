CREATE TABLE "savings_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"target_amount" integer NOT NULL,
	"saved_amount" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'BDT' NOT NULL,
	"deadline" text,
	"category" text DEFAULT 'General',
	"created_at" timestamp DEFAULT now()
);
