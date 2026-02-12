import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Membuat token JWT
 * @param {Object} payload - The payload to encode
 * @returns {string} - The generated token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  })
}

/**
 * Verifikasi JWT tokennya
 * @param {string} token - The token to verify
 * @returns {Object|null} - The verified token or null if invalid
 */
export function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Middleware untuk verfikasi JWT token
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object
 */
export async function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1]
  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }
  const payload = verifyJWT(token)
  if (!payload) {
    return new Response("Unauthorized", { status: 401 })
  }
  return next()
}
