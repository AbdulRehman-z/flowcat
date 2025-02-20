DROP INDEX "name_userId_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "name_userId_idx" ON "userPrompts" USING btree ("user_id","title","is_default");