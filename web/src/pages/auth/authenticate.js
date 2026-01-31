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
  const { data } = await axios.post("/api/login", formData)
  return data.token // throws on non-2xx
}

/**
 * Map axios error to user message
 * (kept next to authenticate so the JSDoc context stays intact)
 */
export function getErrorMessage(error) {
  if (!error.response) return "Tidak dapat terhubung ke server."
  const { status, data } = error.response

  // If status is 401, show NIP / password salah
  if (status === 401) return data.message || "NIP / password salah."
  // If status is 422, show validation errors
  if (status === 422 && data.errors) return Object.values(data.errors).join(" ")
  return data.message || "Terjadi kesalahan."
}
