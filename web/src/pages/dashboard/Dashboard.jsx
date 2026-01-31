import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  MoreVertical,
  FolderKanban,
} from "lucide-react"
import axios from "axios"
import { format } from "date-and-time"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const today = format(new Date(), "dddd, DD MMMM YYYY")
  const navigate = useNavigate()

  const [log, setLog] = useState({
    tanggal: "",
    judul: "",
    deskripsi: "",
    status: false,
  })
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    completedLogs: 0,
    pendingLogs: 0,
  })
  const [activities, setActivities] = useState([])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }

        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUsername(response.data.username)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token")
          navigate("/")
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setStats(response.data.data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchProfile()
    fetchStats()
  }, [])

  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        // First get user profile to get user ID
        const profileResponse = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userId = profileResponse.data.data.id

        // Then fetch user logs
        const logsResponse = await axios.get(`/api/user-log/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Transform the data to match the expected format
        const transformedLogs = logsResponse.data.data.map((log, index) => ({
          id: log.id || index + 1,
          time: log.tanggal ? new Date(log.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "00:00",
          date: log.tanggal ? new Date(log.tanggal).toLocaleDateString('id-ID', { weekday: 'long' }) : "Hari ini",
          title: log.judul || "Log Entry",
          description: log.deskripsiPekerjaan || "No description available",
          status: log.status ? "Selesai" : "Menunggu",
          variant: log.status ? "default" : "secondary",
        }))

        setActivities(transformedLogs)
      } catch (error) {
        console.error("Failed to fetch user logs:", error)
      }
    }

    fetchUserLogs()
  }, [])
  
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
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {today}
              </p>
              <h1 className="text-xl font-bold text-slate-800 mt-0.5">
                {loading ? "Memuat..." : `Halo, ${username || "Pengguna"}`}
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
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
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

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          {statsData.map((stat, index) => (
            <Card
              key={index}
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

        {/* Quick Action */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 text-white shadow-lg shadow-orange-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Buat Log Baru</h3>
              <p className="text-orange-100 text-sm">
                Catat kegiatan atau insiden hari ini.
              </p>
            </div>
            <Button
              size="icon"
              className="rounded-full bg-white text-orange-600 hover:bg-orange-50 h-12 w-12 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </CardContent>
        </Card>

        {/* Logs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-slate-400" />
              Riwayat Log
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-700 text-xs font-medium"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => {
              // Determine badge color based on status
              let badgeVariant = "secondary"
              if (activity.status === "Selesai") badgeVariant = "default"
              if (activity.status === "Verified") badgeVariant = "outline"

              return (
                <Card
                  key={activity.id}
                  className="border-slate-100 shadow-sm hover:border-orange-200 transition-colors group cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Date Column */}
                      <div className="flex flex-col items-center justify-center min-w-[3.5rem] border-r border-slate-100 pr-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {activity.date.split(" ")[0]}
                        </span>
                        <span className="text-xl font-bold text-slate-800 leading-none mt-1">
                          {activity.time}
                        </span>
                      </div>

                      {/* Content Column */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                            {activity.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={badgeVariant}
                            className="text-[10px] px-2 py-0.5 h-5"
                          >
                            {activity.status}
                          </Badge>
                          {activity.date === "Hari ini" && (
                            <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-1.5 rounded">
                              Baru
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
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

          {/* Center Add Button FAB */}
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
