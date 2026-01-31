import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bell,
  Plus,
  TrendingUp,
  Calendar,
  Settings,
  Grid3x3,
  Menu,
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    { label: "Total Log", value: "12", color: "bg-orange-400" },
    { label: "Bulan Ini", value: "5", color: "bg-orange-300" },
    { label: "Hari Ini", value: "2", color: "bg-orange-200" },
  ]

  const activities = [
    {
      id: 1,
      time: "8:00 - 09:15",
      title: "Dokumen DOKSLI",
      description:
        "Pengerjaan dokumen administrasi kepegawaian untuk data PNS baru",
      status: "Selesai",
    },
    {
      id: 2,
      time: "8:00 - 09:15",
      title: "Dokumen DOKSLI",
      description:
        "Pengerjaan dokumen administrasi kepegawaian untuk data PNS baru",
      status: "Selesai",
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-400 via-orange-500 to-amber-600">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-amber-500 p-6 pb-32">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-5 h-5" />
            <span
              className="text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Senin, 26 Januari 2026
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">👤</span>
            </div>
          </div>
          <div className="text-white">
            <p
              className="text-sm opacity-90"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Selamat Pagi
            </p>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              RAJAMUDA ASDI
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.color} border-0 shadow-lg`}>
              <CardContent className="p-4 text-center">
                <p
                  className="text-3xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-lg text-white/90"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-20">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Tambah Log
                </p>
                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Catat aktivitas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Statistika
                </p>
                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Lihat Laporan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activities */}
        <Card className="bg-white border-0 shadow-lg mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Calendar className="w-5 h-5 text-orange-500" />
                Aktivitas Hari Ini
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <span className="text-orange-500">📊</span>
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <span className="text-gray-600">🖨️</span>
                </Button>
              </div>
            </div>
            <p
              className="text-xs text-gray-500 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Senin, 26 Januari 2026
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-orange-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-white text-lg">📄</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs text-gray-600"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          ⏰ {activity.time}
                        </span>
                        <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded">
                          {activity.status}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-gray-800 mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {activity.title}
                      </h3>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Button variant="ghost" size="icon" className="text-orange-500">
            <Grid3x3 className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Menu className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
