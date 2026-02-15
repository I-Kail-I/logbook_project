import { NextResponse } from "next/server"
import { db } from "@/config/db/db"
import { bookSave } from "@/config/db/schema"
import { eq, count } from "drizzle-orm"
import { verifyJWT } from "@/lib/auth"

/**
 * Route: /api/stats
 * Purpose: Get user statistics (total logs, completed, pending)
 *
 * @param {Request} req
 * @returns {NextResponse}
 */
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value
    const authHeader = req.headers.get("authorization")
    const bearerToken = authHeader?.split(" ")[1]
    const finalToken = token || bearerToken

    if (!finalToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJWT(finalToken)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.userId
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      )
    }

    // Getting all the logs
    const userLogs = await db
      .select({
        id: bookSave.id,
        status: bookSave.status,
      })
      .from(bookSave)
      .where(eq(bookSave.userId, userId))

    const totalLogs = userLogs.length
    const completedLogs = userLogs.filter((log) => log.status === true).length
    const pendingLogs = totalLogs - completedLogs

    return NextResponse.json({
      message: "Stats retrieved successfully",
      data: {
        totalLogs,
        completedLogs,
        pendingLogs,
      },
    })
  } catch (error) {
    console.error("Stats controller error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
