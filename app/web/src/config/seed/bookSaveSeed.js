import { db } from "../db/db"
import { faker } from "@faker-js/faker"
import { bookSave } from "../db/schema"
import { users } from "../db/schema"

/**
 * How to run:
 *  terminal
 *  npx tsx src/config/seed/bookSaveSeed.js
 */

export async function bookSaveSeeder() {
  console.log("Seeding book_save table")

  await db.delete(bookSave).execute()

  // Getting all the avaiable users id
  const existingUsers = await db.select({ id: users.id }).from(users)
  const userIds = existingUsers.map((u) => u.id)

  if (userIds.length === 0) {
    throw new Error("No users found! Please seed the users table first.")
  }

  // Creating the seed data
  const bookSaveData = Array.from({ length: 150 }, () => {
    const randomUserId = faker.helpers.arrayElement(userIds)
    return {
      userId: randomUserId,
      namaAktifitas: faker.lorem.sentence({ min: 3, max: 5 }),
      deskripsiPekerjaan: faker.lorem.paragraph(2),
      status: faker.datatype.boolean({ probability: 0.5 }),
      tanggal: faker.date.past(),
      fileUrl: faker.internet.url(),
      delete: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }
  })

  // Inserting the data to the book_save table
  await db.insert(bookSave).values(bookSaveData).onConflictDoNothing().execute()
  console.log(`Successfully seeded ${bookSaveData.length} book_save records`)
}

bookSaveSeeder().catch((error) => {
  console.error("Seeding error:", error)
  process.exit(1)
})
