ALTER TABLE "book_save" ALTER COLUMN "tanggal" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "book_save" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_profile" text NOT NULL;