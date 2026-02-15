import { useState } from "react"

/**
 * @param {Event} e
 *
 * Function that handling the changes for the inputs
 */
export default function useLoginForm() {
  const [formData, setFormData] = useState({ nip: "", password: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return { formData, handleChange }
}
