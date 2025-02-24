ALTER TABLE "promptLikes" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "promptLikes" ALTER COLUMN "prompt_id" DROP NOT NULL;