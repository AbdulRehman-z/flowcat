ALTER TABLE "userPrompts" ALTER COLUMN "hearts" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "userPrompts" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "userPrompts" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "userPrompts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userPrompts" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userPrompts" DROP COLUMN "categories";