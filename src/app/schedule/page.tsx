"use client"

import { useState } from "react"
import { useTeam } from "@/contexts/team-context"
import GameCard from "@/components/game-card"
import type { Game } from "@/types"
import { TEAMS } from "@/constants/teams"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

// Mock schedule data
const generateMockSchedule = (): Game[] => {
  const games: Game[] = []
  const today = new Date()

  for (let i = -7; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Generate 2-3 games per day
    const gamesPerDay = Math.floor(Math.random() * 2) + 2

    for (let j = 0; j < gamesPerDay; j++) {
      const homeTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)]
      let awayTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)]

      // Ensure different teams
      while (awayTeam.code === homeTeam.code) {
        awayTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)]
      }

      const game: Game = {
        id: `${date.toISOString().split("T")[0]}-${j}`,
        date: date.toISOString().split("T")[0],
        time: j === 0 ? "14:00" : "18:30",
        home: homeTeam,
        away: awayTeam,
        stadium: `${homeTeam.name} 홈구장`,
        status: i < 0 ? "finished" : i === 0 ? "live" : "scheduled",
        homeScore: i < 0 ? Math.floor(Math.random() * 10) : undefined,
        awayScore: i < 0 ? Math.floor(Math.random() * 10) : undefined,
      }

      games.push(game)
    }
  }

  return games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default function SchedulePage() {
  const { selectedTeam } = useTeam()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [schedule] = useState(generateMockSchedule())

  const filteredSchedule = schedule.filter((game) => {
    if (filterTeam === "all") return true
    if (filterTeam === "my-team") {
      return game.home.code === selectedTeam.code || game.away.code === selectedTeam.code
    }
    return game.home.code === filterTeam || game.away.code === filterTeam
  })

  const groupedSchedule = filteredSchedule.reduce(
    (acc, game) => {
      const date = game.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(game)
      return acc
    },
    {} as Record<string, Game[]>,
  )

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">경기 일정</h1>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 팀</option>
              <option value="my-team">내 팀 ({selectedTeam.name})</option>
              {TEAMS.map((team) => (
                <option key={team.code} value={team.code}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
        <button
          onClick={goToPreviousWeek}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          이전 주
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
          })}
        </h2>

        <button
          onClick={goToNextWeek}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          다음 주
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Schedule List */}
      <div className="space-y-6">
        {Object.entries(groupedSchedule).map(([date, games]) => (
          <div key={date} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              {new Date(date).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSchedule.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">선택한 조건에 맞는 경기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
