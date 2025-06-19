import type { PlayerStats } from "@/types"
import Image from "next/image"

interface PlayerStatsTableProps {
  players: PlayerStats[]
  title: string
  type: "batting" | "pitching"
}

export default function PlayerStatsTable({ players, title, type }: PlayerStatsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">선수명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">팀</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                포지션
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">경기</th>
              {type === "batting" ? (
                <>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    타율
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    홈런
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    타점
                  </th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평균자책점
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    승/세이브
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    삼진
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player, index) => (
              <tr key={player.playerId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index < 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Image
                      src={player.team.logoUrl || "/placeholder.svg"}
                      alt={player.team.name}
                      width={20}
                      height={20}
                      className="rounded-md"
                    />
                    <span className="text-sm text-gray-900">{player.team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{player.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{player.games}</td>
                {type === "batting" ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {player.battingAverage?.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-orange-600">
                      {player.homeRuns}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600">
                      {player.rbis}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {player.era?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">
                      {player.wins || player.saves}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-purple-600">
                      {player.strikeouts}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
