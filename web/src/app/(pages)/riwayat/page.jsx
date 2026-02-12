"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UserLogCard from "@/components/ui/user-log/userLogCard"
import UpdateLogCard from "@/components/ui/user-log/updateLogCard"
import {
  Bell,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Calendar,
  Settings,
  Home,
  LogOut,
  Search,
  FolderKanban,
  Filter,
} from "lucide-react"
import axios from "axios"
import getInfoDate from "@/components/ui/date"

/**
 * Riwayat Page - Menampilkan semua log user
 */
export default function RiwayatPage() {
  const router = useRouter()
  const { fullDate, today } = getInfoDate()

  const [nama, setNama] = useState("")
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])
  const [editingLogId, setEditingLogId] = useState(null)
  const [filter, setFilter] = useState("semua") // semua, hari-ini, selesai, menunggu

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

  /* ---------- fetch functions ---------- */
  const fetchUserLogs = async () => {
    if (!userId) return

    try {
      const res = await axios.get(`/api/user-log/${userId}`, {
        withCredentials: true,
      })

      const transformed = res.data.data.map((log, idx) => {
        const logDate = new Date(log.tanggal)
        const isToday = logDate.toDateString() === new Date().toDateString()

        return {
          id: log.id || idx + 1,
          time: log.tanggal
            ? logDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00",
          date: isToday
            ? "Hari ini"
            : logDate.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
              }),
          title: log.judul || "Log Entry",
          description: log.deskripsiPekerjaan || "Tidak ada deskripsi",
          status: log.status ? "Selesai" : "Menunggu",
          isNew: isToday,
          originalData: log,
          // Add filter properties
          isToday: isToday,
          isCompleted: log.status,
          isPending: !log.status,
        }
      })

      setActivities(transformed)
    } catch (err) {
      console.error("Gagal fetch logs:", err)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserLogs()
    }
  }, [userId])

  /* ---------- Log Management Handlers ---------- */
  const handleEditLog = (logId) => {
    setEditingLogId(logId)
  }

  const handleUpdateSuccess = (updatedLog) => {
    setEditingLogId(null)
    fetchUserLogs()
  }

  const handleDeleteSuccess = (deletedLog) => {
    setEditingLogId(null)
    fetchUserLogs()
  }

  const handleCancelEdit = () => {
    setEditingLogId(null)
  }

  /* ---------- Filter Functions ---------- */
  const filteredActivities = activities.filter((act) => {
    switch (filter) {
      case "hari-ini":
        return act.isToday
      case "selesai":
        return act.isCompleted
      case "menunggu":
        return act.isPending
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="rounded-full text-slate-600 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {fullDate}
                </p>
                <h1 className="text-xl font-bold text-slate-800 mt-0.5">
                  {loading ? "Memuat..." : `Riwayat, ${nama || "Pengguna"}`}
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
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Filter */}
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 bg-transparent border-0 text-sm font-medium text-slate-700 focus:outline-none focus:ring-0"
              >
                <option value="semua">Semua Log</option>
                <option value="hari-ini">Hari Ini</option>
                <option value="selesai">Selesai</option>
                <option value="menunggu">Menunggu</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-slate-100">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-blue-600">
                {activities.length}
              </p>
              <p className="text-xs text-slate-500">Total</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-green-600">
                {activities.filter((a) => a.isCompleted).length}
              </p>
              <p className="text-xs text-slate-500">Selesai</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-yellow-600">
                {activities.filter((a) => a.isPending).length}
              </p>
              <p className="text-xs text-slate-500">Menunggu</p>
            </CardContent>
          </Card>
        </div>

        {/* Riwayat log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-slate-400" />
              {filter === "semua" && "Semua Log"}
              {filter === "hari-ini" && "Log Hari Ini"}
              {filter === "selesai" && "Log Selesai"}
              {filter === "menunggu" && "Log Menunggu"}
            </h2>
            <p className="text-sm text-slate-500">
              {filteredActivities.length} dari {activities.length} log
            </p>
          </div>

          <div className="space-y-4">
            {filteredActivities.length ? (
              filteredActivities.map((act) => (
                <div key={act.id}>
                  {editingLogId === act.id ? (
                    <UpdateLogCard
                      log={act.originalData}
                      onSuccess={handleUpdateSuccess}
                      onCancel={handleCancelEdit}
                      isEditing={true}
                      onEditToggle={() => setEditingLogId(null)}
                    />
                  ) : (
                    <div
                      onClick={() => handleEditLog(act.id)}
                      className="cursor-pointer"
                    >
                      <UserLogCard
                        date={act.date}
                        time={act.time}
                        title={act.title}
                        description={act.description}
                        status={act.status}
                        isNew={act.isNew}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <Card className="border-slate-100">
                <CardContent className="p-8 text-center">
                  <div className="text-slate-400 mb-2">
                    <FolderKanban className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Tidak Ada Log
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Tidak ada log yang cocok dengan filter yang dipilih.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
