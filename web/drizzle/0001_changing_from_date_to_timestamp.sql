ALTER TABLE "book_save" ALTER COLUMN "username_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "book_save" ALTER COLUMN "tanggal" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "book_save" ALTER COLUMN "tanggal" SET DEFAULT timestamp;--> statement-breakpoint
ALTER TABLE "book_save" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "book_save" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "nip" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';