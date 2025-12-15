"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTeam } from "@/contexts/team-context"
import HighlightCard from "@/components/highlight-card"
import type { Highlight } from "@/types"
import { Search } from "lucide-react"
import { getCachedHighlights } from "@/lib/kbo-data"

const ITEMS_PER_PAGE = 12

export default function HighlightsPage() {
  const { selectedTeam } = useTeam()
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [activeCategory, setActiveCategory] = useState<"highlight" | "recent" | "legend" | "favorite">("recent")
  const [sortOrder, setSortOrder] = useState<"date" | "relevance">("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true)
      setApiError(false)
      setDisplayedCount(ITEMS_PER_PAGE) // 카테고리 변경 시 초기화
      try {
        // 즐겨찾기는 서버 검색 없이 클라이언트 필터링만
        if (activeCategory === "favorite") {
          setHighlights([])
        } else {
          const result = await getCachedHighlights(
            selectedTeam.code,
            activeCategory,
            activeCategory === "highlight" ? sortOrder : "relevance"
          )
          setHighlights(result.data || [])
          if (result.error) {
            setApiError(true)
          }
        }
      } catch (error) {
        console.error("하이라이트 로딩 실패:", error)
        setHighlights([])
        setApiError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchHighlights()
  }, [selectedTeam.code, activeCategory, sortOrder])

  // 즐겨찾기 영상은 모든 highlights에서 가져옴
  const allHighlightsForFavorites = highlights

  const categories = [
    { key: "recent" as const, label: "최신", count: highlights.length },
    { key: "highlight" as const, label: "하이라이트", count: highlights.length },
    { key: "legend" as const, label: "레전드", count: highlights.length },
    { key: "favorite" as const, label: "즐겨찾기", count: favorites.length },
  ]

  const filteredHighlights = (activeCategory === "favorite" ? allHighlightsForFavorites : highlights).filter((highlight) => {
    // Category filter
    if (activeCategory === "favorite") {
      if (!favorites.includes(highlight.id)) return false
    }

    // Search filter
    if (searchQuery) {
      return highlight.title.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  // 검색어 변경 시 displayedCount 초기화
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE)
  }, [searchQuery])

  // 표시할 하이라이트 (무한 스크롤용)
  const displayedHighlights = filteredHighlights.slice(0, displayedCount)
  const hasMore = displayedCount < filteredHighlights.length

  // 무한 스크롤: Intersection Observer로 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setDisplayedCount((prev) => prev + ITEMS_PER_PAGE)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loading, hasMore])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">영상</h1>

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
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.key ? "text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              style={activeCategory === category.key ? { backgroundColor: selectedTeam.color } : {}}
            >
              {category.key === "favorite" ? `${category.label} (${category.count})` : category.label}
            </button>
          ))}
        </div>

        {/* 정렬 옵션 (하이라이트 카테고리일 때만 표시) */}
        {activeCategory === "highlight" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <button
              onClick={() => setSortOrder("date")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortOrder === "date" ? "text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              style={sortOrder === "date" ? { backgroundColor: selectedTeam.color } : {}}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder("relevance")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortOrder === "relevance" ? "text-white" : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
              style={sortOrder === "relevance" ? { backgroundColor: selectedTeam.color } : {}}
            >
              인기순
            </button>
          </div>
        )}
      </div>

      {/* Highlights Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">로딩 중...</p>
        </div>
      ) : apiError ? (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-yellow-800 font-medium mb-2">YouTube API가 활성화되지 않았습니다</p>
            <p className="text-yellow-700 text-sm mb-4">
              Google Cloud Console에서 YouTube Data API v3를 활성화해주세요.
            </p>
            <a
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              YouTube Data API v3 활성화하기 →
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedHighlights.map((highlight) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(highlight.id)}
              />
            ))}
          </div>

          {/* 무한 스크롤 트리거 */}
          {hasMore && (
            <div ref={observerTarget} className="py-8 text-center">
              <p className="text-gray-500">더 많은 영상 로딩 중...</p>
            </div>
          )}

          {filteredHighlights.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{searchQuery ? "검색 결과가 없습니다." : "하이라이트가 없습니다."}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
