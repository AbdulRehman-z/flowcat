CREATE TABLE "userSavedJobs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"clientBudget" text NOT NULL,
	"jobType" text NOT NULL,
	"experienceLevel" text NOT NULL,
	"duration" text NOT NULL,
	"posted" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userData" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "userData" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "userData" DROP COLUMN "favouritePrompts";--> statement-breakpoint
ALTER TABLE "userData" DROP COLUMN "appliedJobs";--> statement-breakpoint
ALTER TABLE "userData" DROP COLUMN "savedJobs";