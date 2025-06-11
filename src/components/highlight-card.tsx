"use client"

import { useState } from "react"
import type { Highlight } from "@/types"
import { Play, Heart, Eye } from "lucide-react"
import Image from "next/image"

interface HighlightCardProps {
  highlight: Highlight
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

export default function HighlightCard({ highlight, onToggleFavorite, isFavorite = false }: HighlightCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handlePlay = () => {
    // YouTube 영상 재생 로직
    window.open(highlight.videoUrl, "_blank")
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-gray-200">
        <Image src={highlight.thumbnail || "/placeholder.svg"} alt={highlight.title} fill className="object-cover" />

        {/* Play Button Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={handlePlay}
        >
          <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
            <Play className="w-6 h-6 text-gray-800 ml-1" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              highlight.category === "recent"
                ? "bg-blue-500 text-white"
                : highlight.category === "legend"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
            }`}
          >
            {highlight.category === "recent" ? "최신" : highlight.category === "legend" ? "레전드" : "즐겨찾기"}
          </span>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(highlight.id)
            }}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{highlight.title}</h3>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(highlight.date).toLocaleDateString("ko-KR")}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{highlight.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
