import { db } from "../config/db"
import { logUser, bookSave } from "../config/schema.js"
import { eq } from "drizzle-orm"

/**
 * user log controller
 * Method: GET
 * For: Getting user log
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').ErrorRequestHandler} error
 */
export async function logUserController(req, res) {
  try {
    const { id } = req.params
    
    // Get user logs with bookSave details
    const logs = await db
      .select({
        id: logUser.id,
        userId: logUser.userId,
        bookSaveId: logUser.bookSaveId,
        tanggal: bookSave.tanggal,
        judul: bookSave.judul,
        deskripsiPekerjaan: bookSave.deskripsiPekerjaan,
        status: bookSave.status,
        createdAt: bookSave.createdAt,
      })
      .from(logUser)
      .innerJoin(bookSave, eq(logUser.bookSaveId, bookSave.id))
      .where(eq(logUser.userId, id))

    res.status(200).json({
      message: "User log retrieved successfully",
      data: logs,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: "Internal server error",
    })
  }
}
