import { NextResponse } from "next/server"
import { db } from "@/config/db/db"
import { bookSave } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { verifyJWT } from "@/lib/auth"

/**
 * Route: /api/logs
 * Purpose: Create new log entry
 */
export async function POST(req) {
  try {
    // Authenticate user
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

    const userId = decoded.userId || decoded.nip

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      )
    }

    const { judul, deskripsiPekerjaan, status, tanggal, usernameId, fileUrl } =
      await req.json()

    console.log("Creating log for user:", userId, "with data:", {
      judul,
      status,
      tanggal,
    })

    // Create new log entry
    const newLog = await db
      .insert(bookSave)
      .values({
        userId: usernameId || userId,
        namaAktifitas: judul,
        deskripsiPekerjaan,
        status: status || false,
        tanggal: new Date(tanggal),
        fileUrl: fileUrl || "", // Use fileUrl from request or default empty
        createdAt: new Date(),
        updatedAt: new Date(),
        delete: false,
      })
      .returning()

    return NextResponse.json({
      message: "Log created successfully",
      data: newLog[0],
    })
  } catch (error) {
    console.error("Create log error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
