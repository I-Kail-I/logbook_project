import { db } from "../config/db"
import { bookSave, logUser } from "../config/schema.js"
import { eq, count, and } from "drizzle-orm"

/**
 * stats controller
 * Method: GET
 * For: Getting user statistics
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').ErrorRequestHandler} error
 */
export async function statsController(req, res) {
  try {
    const userId = req.user.id

    // Get total logs for this user
    const totalLogsResult = await db
      .select({ count: count() })
      .from(logUser)
      .where(eq(logUser.userId, userId))

    // Get all bookSave entries for this user to calculate stats
    const userLogsResult = await db
      .select({
        id: bookSave.id,
        status: bookSave.status,
      })
      .from(logUser)
      .innerJoin(bookSave, eq(logUser.bookSaveId, bookSave.id))
      .where(eq(logUser.userId, userId))

    const totalLogs = totalLogsResult[0]?.count || 0
    const completedLogs = userLogsResult.filter(log => log.status === true).length
    const pendingLogs = totalLogs - completedLogs

    res.status(200).json({
      message: "Stats retrieved successfully",
      data: {
        totalLogs,
        completedLogs,
        pendingLogs
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: "Internal server error",
    })
  }
}
