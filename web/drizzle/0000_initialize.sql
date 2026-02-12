CREATE TYPE "public"."users_role" AS ENUM('super_admin', 'admin', 'user');--> statement-breakpoint
CREATE TABLE "book_save" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"nama_aktifitas" varchar(255) NOT NULL,
	"deskripsi_pekerjaan" varchar(500) NOT NULL,
	"status" boolean DEFAULT false,
	"tanggal" date DEFAULT CURRENT_DATE,
	"file_url" text NOT NULL,
	"delete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "book_save" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reset_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" varchar(128),
	"created_at" timestamp DEFAULT now(),
	"used" boolean DEFAULT false,
	CONSTRAINT "reset_token_token_hash_key" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "reset_token" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(18) NOT NULL,
	"nama_lengkap" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"no_telepon" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "users_role" DEFAULT 'user'
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "book_save" ADD CONSTRAINT "book_save_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_token" ADD CONSTRAINT "reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;