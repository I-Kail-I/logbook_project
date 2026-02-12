import React, { useState, useEffect } from "react"
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
import { Calendar, Save, X, Edit2 } from "lucide-react"
import { format } from "date-and-time"

/**
 * UpdateLogCard - Component for updating existing log entries
 * @param {Object} props
 * @param {Object} props.log - The log data to update
 * @param {Function} props.onSuccess - Callback when log is updated successfully
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @param {boolean} props.isEditing - Whether the card is in edit mode
 * @param {Function} props.onEditToggle - Toggle edit mode
 */
export default function UpdateLogCard({
  log,
  onSuccess,
  onCancel,
  isEditing,
  onEditToggle,
}) {
  const [formData, setFormData] = useState({
    id: log.id,
    judul: log.judul || "",
    deskripsiPekerjaan: log.deskripsiPekerjaan || "",
    status: log.status || false,
    tanggal: log.tanggal
      ? format(new Date(log.tanggal), "YYYY-MM-DD")
      : format(new Date(), "YYYY-MM-DD"),
    fileUrl: log.fileUrl || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Update form data when log prop changes
  useEffect(() => {
    setFormData({
      id: log.id,
      judul: log.judul || "",
      deskripsiPekerjaan: log.deskripsiPekerjaan || "",
      status: log.status || false,
      tanggal: log.tanggal
        ? format(new Date(log.tanggal), "YYYY-MM-DD")
        : format(new Date(), "YYYY-MM-DD"),
      fileUrl: log.fileUrl || "",
    })
  }, [log])

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
      const response = await axios.put(
        `/api/logs/${formData.id}`,
        {
          ...formData,
          tanggal: new Date(formData.tanggal).toISOString(),
        },
        {
          withCredentials: true,
        }
      )

      console.log("Log updated:", response.data)
      onSuccess(response.data)
    } catch (err) {
      console.error("Error updating log:", err)
      setError(err.response?.data?.message || "Gagal memperbarui log")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus log ini?")) return

    setLoading(true)
    try {
      await axios.delete(`/api/logs/${formData.id}`, {
        withCredentials: true,
      })

      console.log("Log deleted:", formData.id)
      onSuccess({ deleted: true, id: formData.id })
    } catch (err) {
      console.error("Error deleting log:", err)
      setError("Gagal menghapus log")
    } finally {
      setLoading(false)
    }
  }

  // Display mode - show log details
  if (!isEditing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{log.judul}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEditToggle}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {log.tanggal
                  ? format(new Date(log.tanggal), "DD MMMM YYYY", {
                      locale: "id-ID",
                    })
                  : "Tanggal tidak tersedia"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.status
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {log.status ? "Selesai" : "Menunggu"}
              </span>
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">
              {log.deskripsiPekerjaan}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Edit mode - show form
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Edit Log
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
              {loading ? "Menyimpan..." : "Perbarui Log"}
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
