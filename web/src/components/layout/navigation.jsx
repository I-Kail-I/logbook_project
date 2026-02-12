'use client'
import React from "react"
import { Button } from "../ui/button"
import { Calendar, Settings, Home, Plus, FolderKanban } from "lucide-react"
import { useRouter } from "next/navigation"


export default function Navigation() {
  const router = useRouter()

  const handleCreateLog = () => {
    router.push("/log-activity")
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-around p-3">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1.5 h-14 w-16 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/riwayat")}
            className="flex flex-col items-center gap-1.5 h-14 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Riwayat</span>
          </Button>

          {/* FAB */}
          <div className="relative -top-8">
            <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl" />
            <Button
              onClick={handleCreateLog}
              className="relative h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-2xl shadow-orange-600/40 border-4 border-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <Plus className="w-7 h-7" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1.5 h-14 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Proyek</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1.5 h-14 w-16 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Setting</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
