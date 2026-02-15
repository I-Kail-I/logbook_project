import React, { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Save, X } from "lucide-react"
import { format } from "date-and-time"

/**
 * CreateLogCard - Component for creating new log entries
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback when log is created successfully
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @param {number} props.userId - Current user ID
 */
export default function CreateLogCard({ onSuccess, onCancel, userId }) {
  const [formData, setFormData] = useState({
    judul: "",
    deskripsiPekerjaan: "",
    status: false,
    tanggal: format(new Date(), "YYYY-MM-DD"),
    fileUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value === "true",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post(
        "/api/logs",
        {
          ...formData,
          usernameId: userId,
          tanggal: new Date(formData.tanggal).toISOString(),
        },
        {
          withCredentials: true,
        }
      )

      onSuccess(response.data)
    } catch (err) {
      console.error("Error creating log:", err)
      setError(err.response?.data?.message || "Gagal membuat log baru")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Buat Log Baru
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Kegiatan</Label>
              <Input
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Masukkan judul kegiatan"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsiPekerjaan">Deskripsi Pekerjaan</Label>
            <Textarea
              id="deskripsiPekerjaan"
              name="deskripsiPekerjaan"
              value={formData.deskripsiPekerjaan}
              onChange={handleChange}
              placeholder="Jelaskan detail pekerjaan yang dilakukan"
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status.toString()}
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Menunggu</SelectItem>
                <SelectItem value="true">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUrl">URL File (Opsional)</Label>
            <Input
              id="fileUrl"
              name="fileUrl"
              type="url"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/file.pdf"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan Log"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
