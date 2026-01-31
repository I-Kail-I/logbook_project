import { pgTable, foreignKey, integer, date, varchar, pgEnum, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const usersRole = pgEnum("users_role", ['admin', 'user'])

export const users = pgTable("users", {
  id: serial().primaryKey(),
  nip: varchar({ length: 18 }),
  username: varchar({ length: 255 }),
  password: varchar({ length: 255 }),
  role: usersRole(),
});

export const bookSave = pgTable("book_save", {
  id: serial().primaryKey(),
  usernameId: integer("username_id"),
  tanggal: date(),
  deskripsiPekerjaan: varchar("deskripsi_pekerjaan", { length: 500 }),
  createdAt: date("created_at"),
}, (table) => [
  foreignKey({
      columns: [table.usernameId],
      foreignColumns: [users.id],
      name: "book_save_username_id_fkey"
    }),
]);

export const logUser = pgTable("log_user", {
  userId: integer("user_id"),
  bookSaveId: integer("book_save_id"),
}, (table) => [
  foreignKey({
      columns: [table.bookSaveId],
      foreignColumns: [bookSave.id],
      name: "log_user_book_save_id_fkey"
    }),
  foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "log_user_user_id_fkey"
    }),
]);