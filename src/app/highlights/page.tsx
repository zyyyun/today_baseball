"use client"

import { useState } from "react"
import { useTeam } from "@/contexts/team-context"
import HighlightCard from "@/components/highlight-card"
import type { Highlight } from "@/types"
import { Search } from "lucide-react"

// Mock highlights data
const mockHighlights: Highlight[] = [
  {
    id: "1",
    title: "SSG 랜더스 9회말 극적인 역전승! 최정 결승 홈런",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example1",
    date: "2025-01-08",
    views: 125000,
    category: "recent",
    teamCode: "SSG",
  },
  {
    id: "2",
    title: "이승엽 레전드 홈런 모음집 - KBO 역사상 최고의 순간들",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example2",
    date: "2025-01-07",
    views: 289000,
    category: "legend",
  },
  {
    id: "3",
    title: "SSG vs LG 하이라이트 - 박병호 3타점 맹활약",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example3",
    date: "2025-01-06",
    views: 67000,
    category: "recent",
    teamCode: "SSG",
  },
  {
    id: "4",
    title: "한국시리즈 명장면 - 감동의 순간들",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example4",
    date: "2025-01-05",
    views: 234000,
    category: "legend",
  },
  {
    id: "5",
    title: "KIA 타이거즈 완벽한 더블플레이 모음",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example5",
    date: "2025-01-04",
    views: 45000,
    category: "recent",
    teamCode: "KIA",
  },
  {
    id: "6",
    title: "LG 트윈스 역대 최고의 순간들",
    thumbnail: "/placeholder.svg?height=180&width=320",
    videoUrl: "https://youtube.com/watch?v=example6",
    date: "2025-01-03",
    views: 156000,
    category: "legend",
    teamCode: "LG",
  },
]

export default function HighlightsPage() {
  const { selectedTeam } = useTeam()
  const [activeCategory, setActiveCategory] = useState<"all" | "recent" | "legend" | "favorite">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = [
    { key: "all" as const, label: "전체", count: mockHighlights.length },
    { key: "recent" as const, label: "최신", count: mockHighlights.filter((h) => h.category === "recent").length },
    { key: "legend" as const, label: "레전드", count: mockHighlights.filter((h) => h.category === "legend").length },
    { key: "favorite" as const, label: "즐겨찾기", count: favorites.length },
  ]

  const filteredHighlights = mockHighlights.filter((highlight) => {
    // Category filter
    if (activeCategory === "favorite") {
      if (!favorites.includes(highlight.id)) return false
    } else if (activeCategory !== "all") {
      if (highlight.category !== activeCategory) return false
    }

    // Search filter
    if (searchQuery) {
      return highlight.title.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">하이라이트</h1>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="하이라이트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.key ? "text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
            style={activeCategory === category.key ? { backgroundColor: selectedTeam.color } : {}}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHighlights.map((highlight) => (
          <HighlightCard
            key={highlight.id}
            highlight={highlight}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(highlight.id)}
          />
        ))}
      </div>

      {filteredHighlights.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{searchQuery ? "검색 결과가 없습니다." : "하이라이트가 없습니다."}</p>
        </div>
      )}
    </div>
  )
}
