export interface Team {
  code: string
  name: string
  color: string
  logoUrl: string
}

export interface Game {
  id: string
  date: string
  time: string
  home: Team
  away: Team
  stadium: string
  status: "scheduled" | "live" | "finished"
  homeScore?: number
  awayScore?: number
  gameId?: string // KBO 게임 ID
  seriesType?: "regular" | "postseason" | "exhibition" // 시리즈 타입
  tvBroadcast?: string // TV 중계 정보
  radioBroadcast?: string // 라디오 중계 정보
  gameCenterUrl?: string // 게임센터 링크
  highlightUrl?: string // 하이라이트 링크
  note?: string // 비고 (우천취소 등)
}

export interface Highlight {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  date: string
  views: number
  category: "recent" | "legend" | "favorite"
  teamCode?: string
}

export interface GameResult {
  game: Game
  winner: Team
  mvp?: string
  summary: string
}

// 기록실 관련 타입들
export interface TeamRanking {
  rank: number
  team: Team
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  gameBehind: number
}

export interface PlayerStats {
  playerId: string
  name: string
  team: Team
  position: string
  games: number
  battingAverage?: number
  homeRuns?: number
  rbis?: number
  era?: number
  wins?: number
  saves?: number
  strikeouts?: number
}

export interface HistoricalRanking {
  year: number
  rankings: TeamRanking[]
  champion: Team
}

// 인증 관련 타입들
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  favoriteTeam?: string
}
