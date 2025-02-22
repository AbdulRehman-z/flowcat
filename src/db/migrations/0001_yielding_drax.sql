CREATE TABLE "promptFavourited" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"prompt_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promptLikes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"prompt_id" text NOT NULL
);
--> statement-breakpoint
DROP INDEX "user_id_prompt_id_idx";--> statement-breakpoint
ALTER TABLE "promptFavourited" ADD CONSTRAINT "promptFavourited_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptLikes" ADD CONSTRAINT "promptLikes_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_prompt_id_idx" ON "promptLikes" USING btree ("user_id","prompt_id");