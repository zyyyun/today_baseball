"use client"

import { useState, useEffect } from "react"
import { useTeam } from "@/contexts/team-context"
import RankingTable from "@/components/records/ranking-table"
import PlayerStatsTable from "@/components/records/player-stats-table"
import type { TeamRanking, PlayerStats, HistoricalRanking } from "@/types"
import { getCurrentSeasonRankings, getTopBatters, getTopPitchers, getHistoricalRankings } from "@/lib/kbo-data"
import { Trophy, Calendar, Users } from "lucide-react"

export default function RecordsPage() {
  const { selectedTeam } = useTeam()
  const [currentRankings, setCurrentRankings] = useState<TeamRanking[]>([])
  const [topBatters, setTopBatters] = useState<PlayerStats[]>([])
  const [topPitchers, setTopPitchers] = useState<PlayerStats[]>([])
  const [historicalRankings, setHistoricalRankings] = useState<HistoricalRanking[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [activeTab, setActiveTab] = useState<"current" | "historical" | "players">("current")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rankings, batters, pitchers, historical] = await Promise.all([
          getCurrentSeasonRankings(),
          getTopBatters(),
          getTopPitchers(),
          getHistoricalRankings(),
        ])

        setCurrentRankings(rankings)
        setTopBatters(batters)
        setTopPitchers(pitchers)
        setHistoricalRankings(historical)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const tabs = [
    { key: "current" as const, label: "현재 시즌", icon: Trophy },
    { key: "historical" as const, label: "역대 기록", icon: Calendar },
    { key: "players" as const, label: "선수 기록", icon: Users },
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">KBO 기록실</h1>
        <p className="text-gray-600">KBO 리그의 모든 기록과 통계를 한눈에 확인하세요</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.key ? "text-white border-b-2" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              style={
                activeTab === tab.key ? { backgroundColor: selectedTeam.color, borderColor: selectedTeam.color } : {}
              }
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === "current" && (
          <>
            <RankingTable rankings={currentRankings} title="2024 시즌 순위" />

            {/* 내 팀 하이라이트 */}
            {currentRankings.length > 0 && (
              <div
                className="bg-white rounded-lg shadow-sm p-6"
                style={{ borderLeft: `4px solid ${selectedTeam.color}` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedTeam.name} 현재 시즌 성적</h3>
                {(() => {
                  const myTeamRanking = currentRankings.find((r) => r.team.code === selectedTeam.code)
                  if (!myTeamRanking) return <p className="text-gray-500">데이터를 찾을 수 없습니다.</p>

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: selectedTeam.color }}>
                          {myTeamRanking.rank}위
                        </div>
                        <div className="text-sm text-gray-500">현재 순위</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{myTeamRanking.winRate.toFixed(3)}</div>
                        <div className="text-sm text-gray-500">승률</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{myTeamRanking.wins}승</div>
                        <div className="text-sm text-gray-500">승수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{myTeamRanking.losses}패</div>
                        <div className="text-sm text-gray-500">패수</div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </>
        )}

        {activeTab === "historical" && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <label className="font-medium text-gray-700">연도 선택:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {historicalRankings.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}년
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const yearData = historicalRankings.find((h) => h.year === selectedYear)
              if (!yearData) return <p className="text-gray-500">해당 연도 데이터가 없습니다.</p>

              return (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-gray-900">{selectedYear}년 한국시리즈 우승팀</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={yearData.champion.logoUrl || "/placeholder.svg"}
                        alt={yearData.champion.name}
                        className="w-12 h-12 rounded-md"
                      />
                      <div>
                        <div className="text-xl font-bold" style={{ color: yearData.champion.color }}>
                          {yearData.champion.name}
                        </div>
                        <div className="text-sm text-gray-500">{selectedYear}년 한국시리즈 우승</div>
                      </div>
                    </div>
                  </div>

                  <RankingTable rankings={yearData.rankings} title={`${selectedYear}년 정규시즌 순위`} />
                </>
              )
            })()}
          </>
        )}

        {activeTab === "players" && (
          <div className="space-y-8">
            <PlayerStatsTable players={topBatters} title="타자 순위 (타율 기준)" type="batting" />
            <PlayerStatsTable players={topPitchers} title="투수 순위 (평균자책점 기준)" type="pitching" />
          </div>
        )}
      </div>
    </div>
  )
}
