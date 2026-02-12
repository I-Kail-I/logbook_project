import { NextResponse } from "next/server"

/**
 * Route: /api/logout
 * Purpose: Clear authentication cookie
 *
 * @param {Request} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  try {
    // Create response that clears the token cookie
    const response = NextResponse.json({
      message: "Logout berhasil",
    })

    // Clear the token cookie
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Immediately expire
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout Error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat logout" },
      { status: 500 }
    )
  }
}
