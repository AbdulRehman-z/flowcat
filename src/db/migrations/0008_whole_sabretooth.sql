ALTER TABLE "userSavedJobs" ADD COLUMN "platform" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userSavedJobs" ADD COLUMN "clientName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userSavedJobs" ADD COLUMN "tokens" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "userSavedJobs" ADD COLUMN "applyUrl" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userSavedJobs" ADD COLUMN "posted" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "userIdTitleIdx" ON "userSavedJobs" USING btree ("userId","title");