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
