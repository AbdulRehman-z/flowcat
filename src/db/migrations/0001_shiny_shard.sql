CREATE TABLE "userData" (
	"id" text PRIMARY KEY NOT NULL,
	"appliedJobs" jsonb[] DEFAULT '{}' NOT NULL,
	"savedJobs" jsonb[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userPrompts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"hearts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
