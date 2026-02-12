import { NextResponse } from "next/server"
import { db } from "@/config/db/db"
import { bookSave } from "@/config/db/schema"
import { eq, desc } from "drizzle-orm"
import { verifyJWT } from "@/lib/auth"

/**
 * Route: /api/users/[userId]/logs
 * Purpose: agar user bisa melihat semua log-nya
 *
 * @param {Request} req
 * @param {Object} context
 * @param {Promise<{ userId: string }>} context.params
 * @returns
 */
export async function GET(req, { params }) {
  try {
    // 1. Get token from cookie first, then fallback to header
    const token = req.cookies.get("token")?.value
    const authHeader = req.headers.get("authorization")
    const bearerToken = authHeader?.split(" ")[1]

    const finalToken = token || bearerToken

    if (!finalToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 2. Verifikasi token & cocokkan userId
    let decoded
    try {
      decoded = verifyJWT(finalToken)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { userId } = await params
    const requestedUserId = parseInt(userId, 10)

    if (!decoded || !decoded.userId || decoded.userId !== requestedUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // 3. Fetch logs
    const logs = await db
      .select({
        id: bookSave.id,
        tanggal: bookSave.tanggal, 
        judul: bookSave.namaAktifitas,
        deskripsiPekerjaan: bookSave.deskripsiPekerjaan,
        status: bookSave.status,
        fileUrl: bookSave.fileUrl,
        createdAt: bookSave.createdAt,
        updatedAt: bookSave.updatedAt,
      })
      .from(bookSave)
      .where(eq(bookSave.userId, requestedUserId))
      .orderBy(desc(bookSave.createdAt))

    return NextResponse.json({ data: logs })
  } catch (error) {
    console.error("User Logs Error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
