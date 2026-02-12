import { pgTable, serial, varchar, foreignKey, integer, text, timestamp, unique, boolean, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const usersRole = pgEnum("users_role", ['super_admin', 'admin', 'user'])


export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  nip: varchar({ length: 18 }).notNull(),
  namaLengkap: varchar("nama_lengkap", { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  noTelepon: varchar("no_telepon", { length: 50 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: usersRole().default('user'),
}).enableRLS();

export const sessions = pgTable("sessions", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  token: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_fkey"
    }),
]).enableRLS();

export const resetToken = pgTable("reset_token", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  tokenHash: varchar("token_hash", { length: 128 }),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  used: boolean().default(false),
}, (table) => [
  foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "reset_token_user_id_fkey"
    }),
  unique("reset_token_token_hash_key").on(table.tokenHash),
]).enableRLS();

export const bookSave = pgTable("book_save", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  namaAktifitas: varchar("nama_aktifitas", { length: 255 }).notNull(),
  deskripsiPekerjaan: varchar("deskripsi_pekerjaan", { length: 500 }).notNull(),
  status: boolean().default(false),
  tanggal: date().default(sql`CURRENT_DATE`),
  fileUrl: text("file_url").notNull(),
  delete: boolean().default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "book_save_user_id_fkey"
    }),
]).enableRLS();
