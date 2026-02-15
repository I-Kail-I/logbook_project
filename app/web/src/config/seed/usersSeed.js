import { faker } from "@faker-js/faker"
import { hash } from "bcrypt"
import { db } from "../db/db.js"
import { users } from "../db/schema.js"

/**
 * How to run:
 *  terminal
 *  npx tsx src/config/seed/usersSeed.js
 */

export async function usersSeeder() {
  console.log("Seeding users table...")

  // Making hash for the user password
  const saltRounds = 13
  const hashedPassword = await hash("123", saltRounds)

  await db.delete(users).execute()

  // Creating the seed data
  const userData = Array.from({ length: 50 }, () => ({
    namaLengkap: faker.person.fullName(),
    nip: faker.string.numeric(18),
    email: faker.internet.email(),
    noTelepon: faker.phone.number(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["super_admin", "admin", "user"]),
  }))

  // Inserting the data into the users table
  await db.insert(users).values(userData).onConflictDoNothing().execute()

  console.log("Seeding users table finished.")
}

usersSeeder().catch((error) => {
  console.error("Seeding error:", error)
  process.exit(1)
})
