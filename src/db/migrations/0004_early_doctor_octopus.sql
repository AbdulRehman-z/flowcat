DROP INDEX "name_userId_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "isDefault_userId_idx" ON "userPrompts" USING btree ("user_id","is_default");--> statement-breakpoint
CREATE UNIQUE INDEX "name_userId_idx" ON "userPrompts" USING btree ("user_id","title");