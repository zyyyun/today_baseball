// KBO 데이터 관련 유틸리티 함수들
import type { TeamRanking, PlayerStats, HistoricalRanking, Highlight, Game } from "@/types"
import { TEAMS } from "@/constants/teams"

// KBO 공식 API 또는 크롤링을 통한 실제 데이터 가져오기
const KBO_API_BASE = "https://www.koreabaseball.com/ws"

// 실제 KBO 순위 데이터 가져오기
export const getCurrentSeasonRankings = async (): Promise<TeamRanking[]> => {
  try {
    // KBO 공식 API 호출 (실제 엔드포인트는 변경될 수 있음)
    const response = await fetch(`${KBO_API_BASE}/Main.asmx/GetTeamRank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leId: "1", // KBO 리그 ID
        srId: "0", // 정규시즌
        date: new Date().toISOString().split("T")[0].replace(/-/g, ""),
      }),
    })

    if (!response.ok) {
      throw new Error("KBO API 호출 실패")
    }

    const data = await response.json()

    // API 응답 데이터를 우리 형식으로 변환
    return data.map((team: any, index: number) => {
      const teamInfo = TEAMS.find((t) => t.name.includes(team.teamName)) || TEAMS[0]

      return {
        rank: index + 1,
        team: teamInfo,
        games: Number.parseInt(team.game),
        wins: Number.parseInt(team.win),
        losses: Number.parseInt(team.lose),
        draws: Number.parseInt(team.drawn),
        winRate: Number.parseFloat(team.wra),
        gameBehind: Number.parseFloat(team.gb) || 0,
      }
    })
  } catch (error) {
    console.error("순위 데이터 로딩 실패:", error)

    // API 실패 시 Mock 데이터 반환
    return [
      {
        rank: 1,
        team: TEAMS.find((t) => t.code === "SSG")!,
        games: 144,
        wins: 87,
        losses: 55,
        draws: 2,
        winRate: 0.613,
        gameBehind: 0,
      },
      {
        rank: 2,
        team: TEAMS.find((t) => t.code === "LG")!,
        games: 144,
        wins: 82,
        losses: 60,
        draws: 2,
        winRate: 0.577,
        gameBehind: 5,
      },
      {
        rank: 3,
        team: TEAMS.find((t) => t.code === "KT")!,
        games: 144,
        wins: 78,
        losses: 64,
        draws: 2,
        winRate: 0.549,
        gameBehind: 9,
      },
      {
        rank: 4,
        team: TEAMS.find((t) => t.code === "KIA")!,
        games: 144,
        wins: 76,
        losses: 66,
        draws: 2,
        winRate: 0.535,
        gameBehind: 11,
      },
      {
        rank: 5,
        team: TEAMS.find((t) => t.code === "NC")!,
        games: 144,
        wins: 74,
        losses: 68,
        draws: 2,
        winRate: 0.521,
        gameBehind: 13,
      },
      {
        rank: 6,
        team: TEAMS.find((t) => t.code === "DOOSAN")!,
        games: 144,
        wins: 72,
        losses: 70,
        draws: 2,
        winRate: 0.507,
        gameBehind: 15,
      },
      {
        rank: 7,
        team: TEAMS.find((t) => t.code === "SAMSUNG")!,
        games: 144,
        wins: 70,
        losses: 72,
        draws: 2,
        winRate: 0.493,
        gameBehind: 17,
      },
      {
        rank: 8,
        team: TEAMS.find((t) => t.code === "LOTTE")!,
        games: 144,
        wins: 68,
        losses: 74,
        draws: 2,
        winRate: 0.479,
        gameBehind: 19,
      },
      {
        rank: 9,
        team: TEAMS.find((t) => t.code === "KIWOOM")!,
        games: 144,
        wins: 65,
        losses: 77,
        draws: 2,
        winRate: 0.458,
        gameBehind: 22,
      },
      {
        rank: 10,
        team: TEAMS.find((t) => t.code === "HANWHA")!,
        games: 144,
        wins: 62,
        losses: 80,
        draws: 2,
        winRate: 0.437,
        gameBehind: 25,
      },
    ]
  }
}

// 타자 순위 데이터 가져오기
export const getTopBatters = async (): Promise<PlayerStats[]> => {
  try {
    const response = await fetch(`${KBO_API_BASE}/Main.asmx/GetBatterRank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leId: "1",
        srId: "0",
        date: new Date().toISOString().split("T")[0].replace(/-/g, ""),
        sortKey: "HRA", // 타율 기준
      }),
    })

    if (!response.ok) {
      throw new Error("타자 데이터 로딩 실패")
    }

    const data = await response.json()

    return data.slice(0, 10).map((player: any) => {
      const teamInfo = TEAMS.find((t) => t.name.includes(player.teamName)) || TEAMS[0]

      return {
        playerId: player.pcode,
        name: player.playerName,
        team: teamInfo,
        position: player.pos,
        games: Number.parseInt(player.gamenum),
        battingAverage: Number.parseFloat(player.hra),
        homeRuns: Number.parseInt(player.hr),
        rbis: Number.parseInt(player.rbi),
      }
    })
  } catch (error) {
    console.error("타자 데이터 로딩 실패:", error)

    // Mock 데이터 반환
    return [
      {
        playerId: "1",
        name: "최정",
        team: TEAMS.find((t) => t.code === "SSG")!,
        position: "3B",
        games: 140,
        battingAverage: 0.312,
        homeRuns: 34,
        rbis: 108,
      },
      {
        playerId: "2",
        name: "박병호",
        team: TEAMS.find((t) => t.code === "SSG")!,
        position: "1B",
        games: 138,
        battingAverage: 0.298,
        homeRuns: 31,
        rbis: 95,
      },
      {
        playerId: "3",
        name: "김하성",
        team: TEAMS.find((t) => t.code === "KIA")!,
        position: "SS",
        games: 142,
        battingAverage: 0.305,
        homeRuns: 18,
        rbis: 78,
      },
      {
        playerId: "4",
        name: "양의지",
        team: TEAMS.find((t) => t.code === "NC")!,
        position: "C",
        games: 135,
        battingAverage: 0.295,
        homeRuns: 22,
        rbis: 89,
      },
      {
        playerId: "5",
        name: "홍창기",
        team: TEAMS.find((t) => t.code === "LG")!,
        position: "OF",
        games: 144,
        battingAverage: 0.301,
        homeRuns: 15,
        rbis: 67,
      },
    ]
  }
}

// 투수 순위 데이터 가져오기
export const getTopPitchers = async (): Promise<PlayerStats[]> => {
  try {
    const response = await fetch(`${KBO_API_BASE}/Main.asmx/GetPitcherRank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leId: "1",
        srId: "0",
        date: new Date().toISOString().split("T")[0].replace(/-/g, ""),
        sortKey: "ERA", // 평균자책점 기준
      }),
    })

    if (!response.ok) {
      throw new Error("투수 데이터 로딩 실패")
    }

    const data = await response.json()

    return data.slice(0, 10).map((player: any) => {
      const teamInfo = TEAMS.find((t) => t.name.includes(player.teamName)) || TEAMS[0]

      return {
        playerId: player.pcode,
        name: player.playerName,
        team: teamInfo,
        position: "P",
        games: Number.parseInt(player.gamenum),
        era: Number.parseFloat(player.era),
        wins: Number.parseInt(player.w),
        saves: Number.parseInt(player.sv),
        strikeouts: Number.parseInt(player.so),
      }
    })
  } catch (error) {
    console.error("투수 데이터 로딩 실패:", error)

    // Mock 데이터 반환
    return [
      {
        playerId: "6",
        name: "김광현",
        team: TEAMS.find((t) => t.code === "SSG")!,
        position: "P",
        games: 32,
        era: 2.45,
        wins: 15,
        strikeouts: 165,
      },
      {
        playerId: "7",
        name: "고영표",
        team: TEAMS.find((t) => t.code === "SSG")!,
        position: "P",
        games: 58,
        era: 1.89,
        saves: 32,
        strikeouts: 78,
      },
      {
        playerId: "8",
        name: "원태인",
        team: TEAMS.find((t) => t.code === "SAMSUNG")!,
        position: "P",
        games: 30,
        era: 2.67,
        wins: 13,
        strikeouts: 142,
      },
      {
        playerId: "9",
        name: "플럭스",
        team: TEAMS.find((t) => t.code === "LG")!,
        position: "P",
        games: 29,
        era: 2.89,
        wins: 14,
        strikeouts: 156,
      },
      {
        playerId: "10",
        name: "임기영",
        team: TEAMS.find((t) => t.code === "KIA")!,
        position: "P",
        games: 55,
        era: 2.12,
        saves: 28,
        strikeouts: 89,
      },
    ]
  }
}

// 역대 순위 데이터 가져오기
export const getHistoricalRankings = async (): Promise<HistoricalRanking[]> => {
  try {
    const years = [2024, 2023, 2022, 2021, 2020]
    const historicalData: HistoricalRanking[] = []

    for (const year of years) {
      try {
        const response = await fetch(`${KBO_API_BASE}/Main.asmx/GetTeamRank`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leId: "1",
            srId: "0",
            date: `${year}1031`, // 해당 연도 시즌 종료일
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const rankings = data.map((team: any, index: number) => {
            const teamInfo = TEAMS.find((t) => t.name.includes(team.teamName)) || TEAMS[0]

            return {
              rank: index + 1,
              team: teamInfo,
              games: Number.parseInt(team.game),
              wins: Number.parseInt(team.win),
              losses: Number.parseInt(team.lose),
              draws: Number.parseInt(team.drawn),
              winRate: Number.parseFloat(team.wra),
              gameBehind: Number.parseFloat(team.gb) || 0,
            }
          })

          // 한국시리즈 우승팀 (실제로는 별도 API나 데이터 필요)
          const champions: { [key: number]: string } = {
            2024: "KIA",
            2023: "LG",
            2022: "SSG",
            2021: "KT",
            2020: "NC",
          }

          historicalData.push({
            year,
            rankings,
            champion: TEAMS.find((t) => t.code === champions[year]) || TEAMS[0],
          })
        }
      } catch (yearError) {
        console.error(`${year}년 데이터 로딩 실패:`, yearError)
      }
    }

    return historicalData.length > 0 ? historicalData : getMockHistoricalData()
  } catch (error) {
    console.error("역대 순위 데이터 로딩 실패:", error)
    return getMockHistoricalData()
  }
}

// Mock 역대 데이터
const getMockHistoricalData = (): HistoricalRanking[] => {
  return [
    {
      year: 2024,
      champion: TEAMS.find((t) => t.code === "KIA")!,
      rankings: [
        {
          rank: 1,
          team: TEAMS.find((t) => t.code === "SSG")!,
          games: 144,
          wins: 87,
          losses: 55,
          draws: 2,
          winRate: 0.613,
          gameBehind: 0,
        },
        // ... 나머지 팀들
      ],
    },
    {
      year: 2023,
      champion: TEAMS.find((t) => t.code === "LG")!,
      rankings: [
        {
          rank: 1,
          team: TEAMS.find((t) => t.code === "LG")!,
          games: 144,
          wins: 89,
          losses: 53,
          draws: 2,
          winRate: 0.627,
          gameBehind: 0,
        },
        // ... 나머지 팀들
      ],
    },
  ]
}

// 경기 일정 데이터 가져오기
export const getScheduleData = async (
  seasonId?: string | number,
  gameMonth?: string | number,
  srIdList: string = "0,9,6",
  teamId: string = ""
): Promise<Game[]> => {
  try {
    const year = seasonId?.toString() || new Date().getFullYear().toString()
    const month = gameMonth 
      ? (typeof gameMonth === "number" 
          ? gameMonth < 10 ? `0${gameMonth}` : `${gameMonth}`
          : gameMonth.length === 1 ? `0${gameMonth}` : gameMonth)
      : (new Date().getMonth() + 1 < 10 
          ? `0${new Date().getMonth() + 1}` 
          : `${new Date().getMonth() + 1}`)

    const queryParams = new URLSearchParams({
      seasonId: year,
      gameMonth: month,
      srIdList,
    })
    
    if (teamId) {
      queryParams.append("teamId", teamId)
    }

    const response = await fetch(`/api/schedule?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("일정 데이터 로딩 실패")
    }

    const result = await response.json()

    if (result.error) {
      console.error("일정 데이터 로딩 오류:", result.message)
      return []
    }

    return result.games || []
  } catch (error) {
    console.error("일정 데이터 로딩 실패:", error)
    return []
  }
}

// 데이터 캐싱을 위한 유틸리티
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5분

export const getCachedData = async <T>(key: string, fetchFn: () => Promise<T>)
: Promise<T> =>
{
  const cached = cache.get(key)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const data = await fetchFn()
  cache.set(key, { data, timestamp: Date.now() })

  return data
}

// 캐시된 데이터 가져오기 함수들
export const getCachedCurrentSeasonRankings = () => getCachedData("current-rankings", getCurrentSeasonRankings)

export const getCachedTopBatters = () => getCachedData("top-batters", getTopBatters)

export const getCachedTopPitchers = () => getCachedData("top-pitchers", getTopPitchers)

export const getCachedHistoricalRankings = () => getCachedData("historical-rankings", getHistoricalRankings)

// 검색 키워드 매핑
const getSearchKeyword = (category: string | undefined, teamName: string): string => {
  switch (category) {
    case "highlight":
      return teamName ? `${teamName} 하이라이트` : "KBO 하이라이트"
    case "legend":
      return teamName ? `${teamName} 레전드 영상` : "KBO 레전드 영상"
    case "recent":
    default:
      return teamName || "KBO"
  }
}

// 기간 필터 매핑
const getPublishedAfter = (category: string | undefined): string => {
  switch (category) {
    case "recent": {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return oneMonthAgo.toISOString()
    }
    case "legend":
      return "none" // 전체 기간
    case "highlight":
    default: {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return oneYearAgo.toISOString()
    }
  }
}

// YouTube API를 통한 하이라이트 가져오기
export const getHighlights = async (
  teamCode?: string,
  category?: string,
  sortOrder: "date" | "relevance" = "relevance"
): Promise<{ data: Highlight[], error?: boolean, message?: string }> => {
  try {
    const teamNames: { [key: string]: string } = {
      SSG: "SSG 랜더스",
      LG: "LG 트윈스",
      KIA: "기아 타이거즈",
      KT: "KT 위즈",
      NC: "NC 다이노스",
      DOOSAN: "두산 베어스",
      SAMSUNG: "삼성 라이온즈",
      LOTTE: "롯데 자이언츠",
      KIWOOM: "키움 히어로즈",
      HANWHA: "한화 이글스",
    }

    const teamName = teamCode ? teamNames[teamCode] : ""
    const searchKeyword = getSearchKeyword(category, teamName)
    const publishedAfter = getPublishedAfter(category)

    const queryParams = new URLSearchParams({
      query: searchKeyword,
      maxResults: "100",
      sortOrder: sortOrder,
      publishedAfter: publishedAfter,
    })

    if (teamCode) {
      queryParams.append("teamCode", teamCode)
    }

    const response = await fetch(`/api/youtube?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error("하이라이트 데이터 로딩 실패")
    }

    const result = await response.json()
    
    // 에러 응답인 경우
    if (result.error) {
      console.error("YouTube API 오류:", result.message)
      return { data: [], error: true, message: result.message }
    }
    
    // 정상 응답인 경우 (배열이 직접 반환된 경우)
    if (Array.isArray(result)) {
      return { data: result }
    }
    
    // 객체 형태로 반환된 경우
    return { data: result.data || [], error: result.error, message: result.message }
  } catch (error) {
    console.error("하이라이트 데이터 로딩 실패:", error)
    return { data: [], error: true, message: "하이라이트 데이터를 가져오는데 실패했습니다." }
  }
}

// 캐시된 하이라이트 가져오기
export const getCachedHighlights = async (
  teamCode?: string,
  category?: string,
  sortOrder: "date" | "relevance" = "relevance"
) => {
  const cacheKey = `highlights-${teamCode || "all"}-${category || "default"}-${sortOrder || "relevance"}`
  const result = await getCachedData(cacheKey, () => getHighlights(teamCode, category, sortOrder))
  return result
}

