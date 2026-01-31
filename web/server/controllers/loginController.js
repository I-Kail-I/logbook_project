import { eq } from "drizzle-orm"
import { db } from "../config/db"
import { users } from "../config/schema.js"
import jwt from "jsonwebtoken"
import process from "node:process"

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {import('express').ErrorRequestHandler} error
 */

export async function loginController(req, res) {
  /**
   * login controller
   * method: POST
   * Login controller, with several conditions
   */
  try {
    const { nip, password } = req.body

    const user = await db.select().from(users).where(eq(users.nip, nip))

    if (user.length === 0) {
      return res.status(400).json({
        error: "Kredensial salah",
      })
    } else {
      if (user[0].password !== password) {
        return res.status(400).json({
          error: "Kredensial salah",
        })
      } else {
        const payload = { id: user[0].id, nip: user[0].nip }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        })

        return res.status(200).json({
          message: "Login berhasil",
          token,
          data: user,
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Masalah internal",
      error: error.message,
    })
  }
}
