import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"

export default function UserLogCard({
  date,
  title,
  description,
  status,
  time,
  isNew = false,
}) {
  let badgeVariant = ""
  if (status === "Selesai" || status === true) badgeVariant = "default"
  if (status === "Menunggu" || status === false) badgeVariant = "outline"

  return (
    <Card className="border-slate-100 shadow-sm hover:border-orange-200 transition-colors group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Date Column */}
          <div className="flex flex-col items-center justify-center min-w-14 border-r border-slate-100 pr-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {date?.split(" ")[0] || "Hari"}
            </span>
            <span className="text-xl font-bold text-slate-800 leading-none mt-1">
              {time}
            </span>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                {title}
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
              {description}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={badgeVariant}
                className="text-[10px] px-2 py-0.5 h-5"
              >
                {status}
              </Badge>
              {isNew && (
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
}
