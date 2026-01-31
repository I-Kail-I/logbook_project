ALTER TABLE "log_user" DROP CONSTRAINT "log_user_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "log_user" ADD COLUMN "username_id" integer;--> statement-breakpoint
ALTER TABLE "log_user" ADD CONSTRAINT "log_user_user_id_fkey" FOREIGN KEY ("username_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_user" DROP COLUMN "user_id";