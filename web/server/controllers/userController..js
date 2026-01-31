import { db } from "../config/db"
import { users } from "../config/schema.js"
import { eq } from "drizzle-orm"

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').ErrorRequestHandler} error
 *
 * Method: GET
 * For: Getting user info (use in profile page)
 */
export async function getUser(req, res) {
  try {
    const { id } = req.params
    const user = await db.select().from(users).where(eq(users.id, id))

    res
      .status(200)
      .json({ message: "Data user berhasil didapat", data: user[0] })
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message })
  }
}
