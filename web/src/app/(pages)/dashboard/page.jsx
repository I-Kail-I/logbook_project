"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UserLogCard from "@/components/ui/user-log/userLogCard"
import CreateLogCard from "@/components/ui/user-log/createLogCard"
import UpdateLogCard from "@/components/ui/user-log/updateLogCard"
import {
  Bell,
  Plus,
  FileText,
  CheckCircle2,
  Calendar,
  Settings,
  Home,
  LogOut,
  Search,
  FolderKanban,
} from "lucide-react"
import axios from "axios"
import getInfoDate from "@/components/ui/date"

/**
 * Dashboard utama user setelah login
 * Menampilkan statistik & riwayat log
 */
export default function Dashboard() {
  const router = useRouter()
  const { fullDate, today } = getInfoDate()

  const [nama, setNama] = useState("")
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    completedLogs: 0,
    pendingLogs: 0,
  })
  const [activities, setActivities] = useState([])

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
  useEffect(() => {
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

    fetchProfile()
  }, [router])

  /* ---------- fetch functions ---------- */
  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/stats", {
        withCredentials: true,
      })
      setStats(res.data.data)
    } catch (err) {
      console.error("Gagal fetch stats:", err)
    }
  }

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
          // Add original log data for editing
          originalData: log,
          // Add today filter property
          isToday: isToday,
        }
      })

      // Filter only today's logs for dashboard
      const todayLogs = transformed.filter((log) => log.isToday)
      setActivities(todayLogs)
    } catch (err) {
      console.error("Gagal fetch logs:", err)
    }
  }

  /* ---------- fetch stats ---------- */
  useEffect(() => {
    fetchStats()
  }, [])

  /* ---------- fetch logs (butuh userId) ---------- */
  useEffect(() => {
    if (userId) {
      fetchUserLogs()
    }
  }, [userId])

  /* ---------- Log Management Handlers ---------- */
  const handleCreateLog = () => {
    router.push("/log-activity")
  }

  const handleEditLog = (logId) => {
    router.push(`/log-activity?edit=${logId}`)
  }

  /* ---------- UI helpers ---------- */
  const statsData = [
    {
      label: "Total Logs",
      value: stats.totalLogs.toString(),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats.completedLogs.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {fullDate}
              </p>
              <h1 className="text-xl font-bold text-slate-800 mt-0.5">
                {loading ? "Memuat..." : `Halo, ${nama || "Pengguna"}`}
              </h1>
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
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <LogOut className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Statistik */}
        <div className="grid grid-cols-2 gap-3">
          {statsData.map((stat, idx) => (
            <Card
              key={idx}
              className="border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Aksi cepat */}
        <Card className="bg-linear-to-r from-orange-500 to-amber-500 border-0 text-white shadow-lg shadow-orange-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Buat Log Baru</h3>
              <p className="text-orange-100 text-sm">
                Catat kegiatan atau insiden hari ini.
              </p>
            </div>
            <Button
              size="icon"
              onClick={handleCreateLog}
              className="rounded-full bg-white text-orange-600 hover:bg-orange-50 h-12 w-12 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </CardContent>
        </Card>

        {/* Riwayat log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-slate-400" />
              Log Hari Ini
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/riwayat")}
              className="text-orange-600 hover:text-orange-700 text-xs font-medium"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-4">
            {activities.length ? (
              activities.map((act) => (
                <div
                  key={act.id}
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
              ))
            ) : (
              <Card className="border-slate-100">
                <CardContent className="p-8 text-center">
                  <div className="text-slate-400 mb-2">
                    <FolderKanban className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Belum Ada Log Hari Ini
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Mulai mencatat kegiatan Anda dengan menekan tombol tambah.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Navigasi bawah */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl z-40">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-12 w-16 text-orange-600 hover:bg-orange-50 rounded-xl"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-12 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium">Jadwal</span>
          </Button>

          {/* FAB */}
          <div className="relative -top-6">
            <Button className="h-14 w-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 border-4 border-slate-50">
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-12 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-medium">Proyek</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-12 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">Setting</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
