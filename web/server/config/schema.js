import {
  pgTable,
  foreignKey,
  integer,
  varchar,
  pgEnum,
  serial,
  timestamp,
  text,
  boolean
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const usersRole = pgEnum("users_role", ["admin", "user"])

export const users = pgTable("users", {
  id: serial().primaryKey(),
  nip: varchar({ length: 18 }).notNull(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: usersRole().default("user"),
  user_profile: text("user_profile").notNull(),
})

export const bookSave = pgTable(
  "book_save",
  {
    id: serial().primaryKey(),
    usernameId: integer("username_id").notNull(),
    tanggal: timestamp().defaultNow(),
    judul: varchar("judul", {length: 255}).notNull(),
    deskripsiPekerjaan: varchar("deskripsi_pekerjaan", { length: 500 }),
    status: boolean("status"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.usernameId],
      foreignColumns: [users.id],
      name: "book_save_username_id_fkey",
    }),
  ]
)

export const logUser = pgTable(
  "log_user",
  {
    userId: integer("username_id"),
    bookSaveId: integer("book_save_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.bookSaveId],
      foreignColumns: [bookSave.id],
      name: "log_user_book_save_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "log_user_user_id_fkey",
    }),
  ]
)
