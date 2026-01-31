CREATE TYPE "public"."users_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "book_save" (
	"id" serial PRIMARY KEY NOT NULL,
	"username_id" integer,
	"tanggal" date,
	"deskripsi_pekerjaan" varchar(500),
	"created_at" date
);
--> statement-breakpoint
CREATE TABLE "log_user" (
	"user_id" integer,
	"book_save_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(18),
	"username" varchar(255),
	"password" varchar(255),
	"role" "users_role"
);
--> statement-breakpoint
ALTER TABLE "book_save" ADD CONSTRAINT "book_save_username_id_fkey" FOREIGN KEY ("username_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_user" ADD CONSTRAINT "log_user_book_save_id_fkey" FOREIGN KEY ("book_save_id") REFERENCES "public"."book_save"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_user" ADD CONSTRAINT "log_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;