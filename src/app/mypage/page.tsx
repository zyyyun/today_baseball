"use client"

import { useTeam } from "@/contexts/team-context"
import { User, Heart, Calendar, Settings, Trophy, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function MyPage() {
  const { selectedTeam, favoriteTeams } = useTeam()

  const stats = [
    { label: "응원한 경기", value: "24", icon: Calendar },
    { label: "즐겨찾기", value: "12", icon: Heart },
    { label: "시청 시간", value: "48h", icon: TrendingUp },
    { label: "획득 배지", value: "5", icon: Trophy },
  ]

  const recentActivity = [
    { type: "game", title: "SSG vs LG 경기 응원", date: "2025-01-08" },
    { type: "highlight", title: "최정 홈런 하이라이트 저장", date: "2025-01-07" },
    { type: "game", title: "SSG vs KIA 경기 응원", date: "2025-01-06" },
    { type: "highlight", title: "박병호 타격 영상 좋아요", date: "2025-01-05" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ backgroundColor: selectedTeam.color }}
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{selectedTeam.name} 팬</h1>
            <p className="opacity-90">열정적인 야구 팬입니다!</p>
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={selectedTeam.logoUrl || "/placeholder.svg"}
                alt={selectedTeam.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-sm">주 응원팀: {selectedTeam.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: selectedTeam.color }} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedTeam.color }} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">설정</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
              <span>알림 설정</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-gray-400" />
              <span>즐겨찾기 관리</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-400" />
              <span>프로필 수정</span>
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Teams */}
      {favoriteTeams.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">관심 팀</h2>
          <div className="flex flex-wrap gap-3">
            {favoriteTeams.map((team) => (
              <div key={team.code} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Image
                  src={team.logoUrl || "/placeholder.svg"}
                  alt={team.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-sm font-medium">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
