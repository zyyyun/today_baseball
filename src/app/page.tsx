"use client"

import { useTeam } from "@/contexts/team-context"
import GameCard from "@/components/game-card"
import HighlightCard from "@/components/highlight-card"
import type { Game, Highlight } from "@/types"
import { TEAMS } from "@/constants/teams"
import { Calendar, TrendingUp, Clock } from "lucide-react"

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
    views: 89000,
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
]

export default function HomePage() {
  const { selectedTeam } = useTeam()

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockHighlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </section>
    </div>
  )
}
