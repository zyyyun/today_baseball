import type { Game } from "@/types"
import Image from "next/image"

interface GameCardProps {
  game: Game
  showDate?: boolean
}

export default function GameCard({ game, showDate = false }: GameCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예정"
      case "live":
        return "진행중"
      case "finished":
        return "종료"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-50"
      case "live":
        return "text-red-600 bg-red-50"
      case "finished":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {showDate && (
        <div className="text-sm text-gray-500 mb-2">
          {new Date(game.date).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Image
            src={game.away.logoUrl || "/placeholder.svg"}
            alt={game.away.name}
            width={32}
            height={32}
          />
          <div>
            <div className="font-semibold text-gray-900">{game.away.name}</div>
            {game.awayScore !== undefined && (
              <div className="text-lg font-bold" style={{ color: game.away.color }}>
                {game.awayScore}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">VS</div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
            {getStatusText(game.status)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-gray-900">{game.home.name}</div>
            {game.homeScore !== undefined && (
              <div className="text-lg font-bold" style={{ color: game.home.color }}>
                {game.homeScore}
              </div>
            )}
          </div>
          <Image
            src={game.home.logoUrl || "/placeholder.svg"}
            alt={game.home.name}
            width={32}
            height={32}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 text-center">
        <div>
          {game.time} • {game.stadium}
        </div>
      </div>
    </div>
  )
}
