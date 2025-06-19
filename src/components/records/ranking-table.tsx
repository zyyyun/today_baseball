import type { TeamRanking } from "@/types"
import Image from "next/image"

interface RankingTableProps {
  rankings: TeamRanking[]
  title: string
}

export default function RankingTable({ rankings, title }: RankingTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">팀</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">경기</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">승</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">패</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">무</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">승률</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                게임차
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings.map((ranking) => (
              <tr key={ranking.team.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        ranking.rank <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ranking.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Image
                      src={ranking.team.logoUrl || "/placeholder.svg"}
                      alt={ranking.team.name}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    <span className="font-medium text-gray-900">{ranking.team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{ranking.games}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600">
                  {ranking.wins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-red-600">
                  {ranking.losses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{ranking.draws}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                  {ranking.winRate.toFixed(3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {ranking.gameBehind === 0 ? "-" : ranking.gameBehind}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
