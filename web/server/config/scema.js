import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", {lenght: 255}).notNull(),
    password: varchar(255, { lenght: 255 }).notNull(),
})