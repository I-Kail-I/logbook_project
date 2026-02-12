import { usersSeeder } from "./usersSeed.js"
import { bookSaveSeeder } from "./bookSaveSeed.js"

/**
 * Main seed file - runs all seeders in order
 * Run with: npx tsx src/config/seed/index.js
 */

async function runAllSeeders() {
  console.log("🌱 Starting database seeding...")
  
  try {
    // Seed users first (bookSave depends on users)
    console.log("\n📋 Step 1: Seeding users table...")
    await usersSeeder()
    
    // Seed bookSave after users are created
    console.log("\n📚 Step 2: Seeding book_save table...")
    await bookSaveSeeder()
    
    console.log("\n✅ Database seeding completed successfully!")
    console.log("🎉 You can now login with any NIP from the seeded users (password: 123)")
    
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

// Run the seeders
runAllSeeders()
