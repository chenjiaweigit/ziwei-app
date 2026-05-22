CREATE TABLE "charts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"birth_info" text NOT NULL,
	"chart" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "divinations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"method" text NOT NULL,
	"question" text DEFAULT '' NOT NULL,
	"result" text NOT NULL,
	"ai_text" text DEFAULT '' NOT NULL,
	"label" text DEFAULT '' NOT NULL,
	"saved_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"label" text NOT NULL,
	"form_data" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"tier" text NOT NULL,
	"status" text DEFAULT 'paid' NOT NULL,
	"paid_at" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	"membership_tier" text DEFAULT 'free' NOT NULL,
	"expires_at" text,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
