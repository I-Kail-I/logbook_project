import { NextResponse } from "next/server"
import { db } from "@/config/db/db"
import { users } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { verifyJWT } from "@/lib/auth"

/**
 * Route: /api/profile
 * Purpose: agar user bisa melihat profile nya
 *
 * @param {Request} req
 * @returns
 */
export async function GET(req) {
  try {
    // 1. Get token from cookie (for cookie-based auth)
    const token = req.cookies.get("token")?.value

    // Fallback to Authorization header if no cookie
    const authHeader = req.headers.get("authorization")
    const bearerToken = authHeader?.split(" ")[1]

    const finalToken = token || bearerToken

    if (!finalToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 2. Verifikasi Token
    let decoded
    try {
      decoded = verifyJWT(finalToken)
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // 3. Get user ID from decoded token (use only userId)
    const userId = decoded.userId

    if (!userId || typeof userId !== "number") {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      )
    }

    // 4. Fetch User
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Frontend akan mendapatkan: response.data.nama
    return NextResponse.json({
      data: { 
        id: user[0].id, 
        nama: user[0].namaLengkap,
        email: user[0].email,
        noTelepon: user[0].noTelepon,
        role: user[0].role,
        nip: user[0].nip
      },
    })
  } catch (error) {
    console.error("Profile Error:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
