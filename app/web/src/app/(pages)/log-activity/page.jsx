"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreateLogCard from "@/components/ui/user-log/createLogCard"
import UpdateLogCard from "@/components/ui/user-log/updateLogCard"
import {
  Bell,
  ArrowLeft,
  Calendar,
  Home,
  LogOut,
  Search,
  Plus,
} from "lucide-react"
import axios from "axios"
import getInfoDate from "@/components/ui/date"

/**
 * Log Activity Page - Create or edit log with overlay modal
 */
function LogActivityContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { fullDate, today } = getInfoDate()

  const editId = searchParams.get("edit")
  const [nama, setNama] = useState("")
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logToEdit, setLogToEdit] = useState(null)
  const [showOverlay, setShowOverlay] = useState(true)

  /* ---------- logout ---------- */
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout error:", error)
    }
    router.push("/")
  }

  /* ---------- fetch profile & userId ---------- */
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile", {
        withCredentials: true,
      })

      setNama(res.data.data.nama)
      if (res.data.data?.id) setUserId(res.data.data.id)
    } catch (err) {
      console.error("Gagal fetch profile:", err)
      if (
        axios.isAxiosError(err) &&
        [401, 403].includes(err.response?.status)
      ) {
        router.push("/")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [router])

  /* ---------- fetch log to edit ---------- */
  const fetchLogToEdit = async () => {
    if (!editId || !userId) return

    try {
      const res = await axios.get(`/api/user-log/${userId}`, {
        withCredentials: true,
      })

      const log = res.data.data.find((l) => l.id == editId)
      if (log) {
        setLogToEdit(log)
      }
    } catch (err) {
      console.error("Gagal fetch log to edit:", err)
    }
  }

  useEffect(() => {
    if (editId && userId) {
      fetchLogToEdit()
    }
  }, [editId, userId])

  /* ---------- Handlers ---------- */
  const handleCreateSuccess = (newLog) => {
    router.push("/dashboard")
  }

  const handleUpdateSuccess = (updatedLog) => {
    router.push("/riwayat")
  }

  const handleCancel = () => {
    if (editId) {
      router.push("/riwayat")
    } else {
      router.push("/dashboard")
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowOverlay(false)
      setTimeout(() => {
        handleCancel()
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Dark Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="rounded-full text-slate-600 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {fullDate}
                </p>
                <h1 className="text-xl font-bold text-slate-800 mt-0.5">
                  {loading
                    ? "Memuat..."
                    : editId
                      ? "Edit Log"
                      : "Buat Log Baru"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-600 hover:bg-slate-100"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-600 hover:bg-slate-100 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <div
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="max-w-md mx-auto px-6 py-6 relative z-50">
        {loading ? (
          <Card className="border-slate-100">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400 mb-2">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Memuat Data...
              </h3>
              <p className="text-sm text-slate-500">Mohon tunggu sebentar.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {editId && logToEdit ? (
              <UpdateLogCard
                log={logToEdit}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancel}
                isEditing={true}
                onEditToggle={() => {}}
              />
            ) : (
              <CreateLogCard
                onSuccess={handleCreateSuccess}
                onCancel={handleCancel}
                userId={userId}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function LogActivityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogActivityContent />
    </Suspense>
  )
}
