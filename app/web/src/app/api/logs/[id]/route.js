import { NextResponse } from "next/server"
import { db } from "@/config/db/db"
import { bookSave } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { verifyJWT } from "@/lib/auth"

/**
 * Route: /api/logs/[id]
 * Purpose: Update or delete specific log entry
 */

// PUT - Update log
export async function PUT(req, { params }) {
  try {
    // Authenticate user
    const token = req.cookies.get("token")?.value
    const authHeader = req.headers.get("authorization")
    const bearerToken = authHeader?.split(" ")[1]

    const finalToken = token || bearerToken

    if (!finalToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJWT(finalToken);

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

    const { id } = await params
    const logId = parseInt(id, 10)
    const { judul, deskripsiPekerjaan, status, tanggal, fileUrl } = await req.json()

    // Update log entry
    const updatedLog = await db
      .update(bookSave)
      .set({
        namaAktifitas: judul,
        deskripsiPekerjaan,
        status: status || false,
        tanggal: new Date(tanggal),
        fileUrl: fileUrl || "",
        updatedAt: new Date(),
      })
      .where(eq(bookSave.id, logId))
      .returning()

    if (!updatedLog.length) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Log updated successfully",
      data: updatedLog[0],
    })
  } catch (error) {
    console.error("Update log error:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    })
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete log (soft delete)
export async function DELETE(req, { params }) {
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

    const { id } = await params
    const logId = parseInt(id, 10)

    // Soft delete log entry
    const deletedLog = await db
      .update(bookSave)
      .set({
        delete: true,
        updatedAt: new Date(),
      })
      .where(eq(bookSave.id, logId))
      .returning()

    if (!deletedLog.length) {
      return NextResponse.json({ message: "Log not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Log deleted successfully",
      data: { deleted: true, id: logId },
    })
  } catch (error) {
    console.error("Delete log error:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    })
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    )
  }
}
