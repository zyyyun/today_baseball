"use client"

import { useTeam } from "@/contexts/team-context"
import GameCard from "@/components/game-card"
import HighlightCard from "@/components/highlight-card"
import type { Game, Highlight } from "@/types"
import { TEAMS } from "@/constants/teams"
import { Calendar, TrendingUp, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getCachedHighlights } from "@/lib/kbo-data"

// Mock data
const mockTodayGame: Game = {
  id: "1",
  date: "2025-01-09",
  time: "18:30",
  home: TEAMS[0], // SSG
  away: TEAMS[1], // LG
  stadium: "인천SSG랜더스필드",
  status: "scheduled",
}

const mockRecentGames: Game[] = [
  {
    id: "2",
    date: "2025-01-08",
    time: "18:30",
    home: TEAMS[0],
    away: TEAMS[2],
    stadium: "인천SSG랜더스필드",
    status: "finished",
    homeScore: 7,
    awayScore: 4,
  },
  {
    id: "3",
    date: "2025-01-07",
    time: "18:30",
    home: TEAMS[3],
    away: TEAMS[0],
    stadium: "광주-기아챔피언스필드",
    status: "finished",
    homeScore: 3,
    awayScore: 8,
  },
  {
    id: "4",
    date: "2025-01-06",
    time: "14:00",
    home: TEAMS[0],
    away: TEAMS[4],
    stadium: "인천SSG랜더스필드",
    status: "finished",
    homeScore: 5,
    awayScore: 2,
  },
]

export default function HomePage() {
  const { selectedTeam } = useTeam()
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true)
      setApiError(false)
      try {
        const result = await getCachedHighlights(selectedTeam.code)
        setHighlights(result.data || [])
        if (result.error) {
          setApiError(true)
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
  }, [selectedTeam.code])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ backgroundColor: selectedTeam.color }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{selectedTeam.name} 팬을 위한 KBO 앱</h1>
          <p className="text-lg opacity-90">오늘의 경기부터 최신 하이라이트까지, 모든 야구 소식을 한눈에</p>
        </div>
        <div className="absolute right-4 top-4 opacity-20">
          <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
            <span className="text-2xl font-bold">KBO</span>
          </div>
        </div>
      </div>

      {/* Today's Game */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" style={{ color: selectedTeam.color }} />
          <h2 className="text-2xl font-bold text-gray-900">오늘의 경기</h2>
        </div>
        <GameCard game={mockTodayGame} />
      </section>

      {/* Recent Games */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" style={{ color: selectedTeam.color }} />
          <h2 className="text-2xl font-bold text-gray-900">최근 경기 결과</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRecentGames.map((game) => (
            <GameCard key={game.id} game={game} showDate />
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: selectedTeam.color }} />
          <h2 className="text-2xl font-bold text-gray-900">오늘의 하이라이트</h2>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : apiError ? (
          <div className="text-center py-8">
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
        ) : highlights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">하이라이트가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((highlight) => (
              <HighlightCard key={highlight.id} highlight={highlight} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
