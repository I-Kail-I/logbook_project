"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UserLogCard from "@/components/ui/user-log/userLogCard"
import {
  Bell,
  Plus,
  FileText,
  CheckCircle2,
  LogOut,
  Search,
  FolderKanban,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react"
import axios from "axios"
import getInfoDate from "@/components/ui/date"

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
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Selamat Pagi")
    else if (hour < 15) setGreeting("Selamat Siang")
    else if (hour < 18) setGreeting("Selamat Sore")
    else setGreeting("Selamat Malam")
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout error:", error)
    }
    router.push("/")
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", { withCredentials: true })
        setNama(res.data.data.nama)
        if (res.data.data?.id) setUserId(res.data.data.id)
      } catch (err) {
        console.error("Gagal fetch profile:", err)
        if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status)) {
          router.push("/")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/stats", { withCredentials: true })
      setStats(res.data.data)
    } catch (err) {
      console.error("Gagal fetch stats:", err)
    }
  }

  const fetchUserLogs = async () => {
    if (!userId) return

    try {
      const res = await axios.get(`/api/user-log/${userId}`, { withCredentials: true })

      const transformed = res.data.data.map((log, idx) => {
        const logDate = new Date(log.tanggal)
        const isToday = logDate.toDateString() === new Date().toDateString()

        return {
          id: log.id || idx + 1,
          time: log.tanggal
            ? logDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
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
          isToday: isToday,
        }
      })

      const todayLogs = transformed.filter((log) => log.isToday)
      setActivities(todayLogs)
    } catch (err) {
      console.error("Gagal fetch logs:", err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserLogs()
    }
  }, [userId])

  const handleCreateLog = () => {
    router.push("/log-activity")
  }

  const handleEditLog = (logId) => {
    router.push(`/log-activity?edit=${logId}`)
  }

  const completionRate = stats.totalLogs > 0 ? Math.round((stats.completedLogs / stats.totalLogs) * 100) : 0

  const statsData = [
    {
      label: "Total Logs",
      value: stats.totalLogs.toString(),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+12%",
    },
    {
      label: "Selesai",
      value: stats.completedLogs.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+8%",
    },
    {
      label: "Progress",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      trend: "+5%",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 font-sans pb-28 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-30 shadow-lg shadow-orange-500/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-orange-100 animate-pulse" />
                <p className="text-xs lg:text-sm font-semibold text-orange-100 uppercase tracking-wider">
                  {fullDate}
                </p>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-1">
                {loading ? "Memuat..." : `${greeting}, ${nama || "Pengguna"}!`}
              </h1>
              <p className="text-sm lg:text-base text-orange-100 font-medium">Semangat untuk hari yang produktif ✨</p>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20 transition-all lg:h-12 lg:w-12">
                <Search className="w-5 h-5 lg:w-6 lg:h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/20 relative transition-all lg:h-12 lg:w-12"
              >
                <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>
              <div
                onClick={handleLogout}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all border-2 border-white/30"
              >
                <LogOut className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Left Column - Stats & Quick Action */}
          <div className="lg:col-span-5 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
              {statsData.map((stat, idx) => (
                <Card
                  key={idx}
                  className={`border ${stat.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
                >
                  <CardContent className="p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left gap-2 lg:gap-4">
                    <div className={`p-3 lg:p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      <stat.icon className={`w-5 h-5 lg:w-7 lg:h-7 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl lg:text-4xl font-bold text-slate-800 leading-none">{stat.value}</p>
                      <p className="text-[10px] lg:text-xs font-semibold text-slate-500 mt-1.5 lg:mt-2 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <div className="flex items-center justify-center lg:justify-start gap-1 mt-1 lg:mt-2">
                        <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                        <span className="text-[9px] lg:text-xs font-bold text-green-600">{stat.trend}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Action */}
            <Card className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 border-0 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <CardContent className="p-6 lg:p-8 flex items-center justify-between relative z-10">
                <div className="space-y-2 lg:space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-orange-100 animate-pulse" />
                    <span className="text-xs lg:text-sm font-semibold text-orange-100 uppercase tracking-wider">Aksi Cepat</span>
                  </div>
                  <h3 className="font-bold text-xl lg:text-2xl">Buat Log Baru</h3>
                  <p className="text-orange-100 text-sm lg:text-base leading-relaxed">
                    Catat kegiatan atau insiden hari ini dengan cepat.
                  </p>
                </div>
                <Button
                  size="icon"
                  onClick={handleCreateLog}
                  className="rounded-full bg-white text-orange-600 hover:bg-orange-50 h-14 w-14 lg:h-16 lg:w-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 shrink-0"
                >
                  <Plus className="w-7 h-7 lg:w-8 lg:h-8" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity Overview */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 lg:p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="p-2 lg:p-3 rounded-xl bg-blue-100">
                        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm lg:text-lg">Aktivitas Hari Ini</h3>
                        <p className="text-xs lg:text-sm text-slate-600">{activities.length} log tercatat</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/riwayat")}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs lg:text-sm font-semibold rounded-xl lg:px-4"
                    >
                      Lihat Semua →
                    </Button>
                  </div>
                </div>

                <div className="p-4 lg:p-6">
                  {activities.length ? (
                    <div className="space-y-3 lg:space-y-4">
                      {activities.slice(0, 5).map((act, idx) => (
                        <div
                          key={act.id}
                          onClick={() => handleEditLog(act.id)}
                          className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
                          style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both` }}
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
                      ))}
                      {activities.length > 5 && (
                        <Button
                          variant="outline"
                          onClick={() => router.push("/riwayat")}
                          className="w-full text-slate-600 hover:bg-slate-50 border-slate-200 rounded-xl font-semibold lg:py-6"
                        >
                          Lihat {activities.length - 5} log lainnya
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 lg:py-16 text-center">
                      <div className="inline-flex p-4 lg:p-6 rounded-full bg-slate-100 mb-4">
                        <FolderKanban className="w-10 h-10 lg:w-14 lg:h-14 text-slate-400" />
                      </div>
                      <h3 className="text-lg lg:text-2xl font-bold text-slate-700 mb-2">Belum Ada Log Hari Ini</h3>
                      <p className="text-sm lg:text-base text-slate-500 mb-6 max-w-xs lg:max-w-md mx-auto">
                        Mulai mencatat kegiatan Anda untuk meningkatkan produktivitas.
                      </p>
                      <Button
                        onClick={handleCreateLog}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/30 lg:px-8 lg:py-6 lg:text-base"
                      >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Buat Log Pertama
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}



    </div>
  )
}