import { db } from "@/config/db/db"
import { users } from "@/config/db/schema"
import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { generateToken } from "@/lib/auth"
import { eq } from "drizzle-orm"

/**
 *
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function POST(req) {
  try {
    const { nip, password } = await req.json()

    const result = await db.select().from(users).where(eq(users.nip, nip))

    // 1. Mengecek akun user
    if (result.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 400 }
      )
    }

    // 2. Mengecek password apakah benar
    if (!(await compare(password, result[0].password))) {
      return NextResponse.json({ error: "Password salah" }, { status: 400 })
    }

    // 3. Pembuatan token
    const token = generateToken({
      userId: result[0].id,
      nip: result[0].nip,
      name: result[0].namaLengkap,
    })

    // 4. Response
    const response = NextResponse.json(
      {
        message: "Login success",
        user: {
          nip: result[0].nip,
          name: result[0].namaLengkap,
          email: result[0].email,
          role: result[0].role,
        },
      },
      { status: 200 }
    )

    // 5. Menyimpan token ke cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Masalah server" }, { status: 500 })
  }
}
