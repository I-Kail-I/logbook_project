import { db } from "../config/db"
import { users } from "../config/schema.js"
import { eq } from "drizzle-orm"

/**
 * user controller 
 * Method: GET
 * For: Getting user info
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').ErrorRequestHandler} error
 */
export async function getUser(req, res) {
  try {
    const userId = req.user.id
    const user = await db.select().from(users).where(eq(users.id, userId))

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res
      .status(200)
      .json({ 
        message: "Data user berhasil didapat", 
        username: user[0].username,
        data: user[0] 
      })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message })
  }
}
