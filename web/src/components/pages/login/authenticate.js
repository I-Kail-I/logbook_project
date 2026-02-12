import axios from "axios"

/**
 * Submit handler.
 * - Prevents default form submission
 * - Resets previous error and sets loading flag
 * - POSTs credentials to /api/login
 * - If success user would usually redirect or store auth data
 * - IF failed I will show a simple client-side error message
 *  @param {Event} e
 */
export default async function authenticate(formData) {
  const response = await axios.post("/api/auth", formData, {
    withCredentials: true, // Important for cookies
  })

  // The token is stored in httpOnly cookie, so we don't need to return it
  // Just return success
  return response.data.user // Return user data instead of token
}

/**
 * Map axios error to user message
 * (kept next to authenticate so the JSDoc context stays intact)
 */
export function getErrorMessage(error) {
  if (!error.response) return "Tidak dapat terhubung ke server."
  const { status, data } = error.response

  // If status is 401, show NIP / password salah
  if (status === 400) return data.error || "NIP / password salah."
  // If status is 422, show validation errors
  if (status === 422 && data.error) return Object.values(data.errors).join(" ")
  return data.message || "Terjadi kesalahan."
}
