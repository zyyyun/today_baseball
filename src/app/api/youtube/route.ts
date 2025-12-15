import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || "KBO 하이라이트"
  const maxResults = searchParams.get("maxResults") || "10"
  const teamCode = searchParams.get("teamCode") // 선택적 팀 필터
  const publishedAfterParam = searchParams.get("publishedAfter") // 기간 필터
  const sortOrder = searchParams.get("sortOrder") || "relevance" // 정렬 순서

  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyBIFbMPggRi5L4J_iiux8X_04MIrS0bOD4"

  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API 키가 설정되지 않았습니다." },
      { status: 500 }
    )
  }

  try {
    // 팀 이름이 있으면 검색 쿼리에 추가
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

    // query 파라미터에 이미 완성된 검색 키워드가 들어있으므로 그대로 사용
    // (kbo-data.ts에서 카테고리에 따라 키워드를 구성하여 전달)
    const searchQuery = query

    // publishedAfter 처리
    let publishedAfter = ""
    if (publishedAfterParam) {
      if (publishedAfterParam === "none") {
        // 전체 기간 검색 (파라미터 제외)
        publishedAfter = ""
      } else {
        publishedAfter = publishedAfterParam
      }
    } else {
      // 기본값: 최근 1년
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      publishedAfter = oneYearAgo.toISOString()
    }

    // 쇼츠를 제외하고도 원하는 개수가 나오도록 더 많이 검색
    // 쇼츠 비율을 고려하여 충분히 많은 결과를 가져옴 (최대 50개)
    const requestedCount = parseInt(maxResults) || 10
    const searchCount = Math.min(requestedCount * 3, 50) // 요청 개수의 3배 또는 최대 50개

    // YouTube API URL 구성
    // 검색은 항상 관련성(relevance) 기준으로 수행
    let apiUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(searchQuery)}&` +
      `type=video&` +
      `maxResults=${searchCount}&` +
      `order=relevance&` +
      `key=${apiKey}`
    
    // publishedAfter가 있으면 추가
    if (publishedAfter) {
      apiUrl += `&publishedAfter=${publishedAfter}`
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("YouTube API 오류:", response.status, errorData)
      
      // 403 에러인 경우 (API 비활성화 또는 권한 없음)
      if (response.status === 403) {
        const errorMessage = errorData.error?.message || "YouTube Data API v3가 활성화되지 않았습니다."
        console.error("YouTube API 비활성화:", errorMessage)
        // API가 비활성화된 경우 에러 정보와 함께 빈 배열 반환
        return NextResponse.json({ 
          error: true, 
          message: "YouTube Data API v3가 활성화되지 않았습니다.",
          data: [] 
        })
      }
      
      throw new Error(`YouTube API 오류: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ data: [], error: false })
    }

    // 비디오 ID 목록 가져오기
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",")

    // 비디오 상세 정보 가져오기 (조회수, 영상 길이 등)
    const detailResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,statistics,contentDetails&` +
      `id=${videoIds}&` +
      `key=${apiKey}`
    )

    if (!detailResponse.ok) {
      const detailErrorData = await detailResponse.json().catch(() => ({}))
      console.error("YouTube API 상세 정보 오류:", detailResponse.status, detailErrorData)
      
      // 403 에러인 경우
      if (detailResponse.status === 403) {
        return NextResponse.json({ 
          error: true, 
          message: "YouTube Data API v3가 활성화되지 않았습니다.",
          data: [] 
        })
      }
      
      throw new Error(`YouTube API 상세 정보 오류: ${detailResponse.statusText}`)
    }

    const detailData = await detailResponse.json()

    // 영상 길이를 초 단위로 변환하는 함수 (ISO 8601 형식: PT1M30S -> 90초)
    const parseDuration = (duration: string): number => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      if (!match) return 0
      const hours = parseInt(match[1] || "0", 10)
      const minutes = parseInt(match[2] || "0", 10)
      const seconds = parseInt(match[3] || "0", 10)
      return hours * 3600 + minutes * 60 + seconds
    }

    // 쇼츠 영상인지 확인하는 함수
    const isShorts = (item: any): boolean => {
      const snippet = item.snippet
      const contentDetails = item.contentDetails
      
      // 제목이나 설명에 "#shorts" 또는 "shorts" 포함 여부 확인
      const title = snippet.title?.toLowerCase() || ""
      const description = snippet.description?.toLowerCase() || ""
      const hasShortsKeyword = title.includes("#shorts") || 
                              title.includes("shorts") || 
                              description.includes("#shorts")
      
      // 영상 길이가 60초 이하인지 확인
      const duration = parseDuration(contentDetails?.duration || "")
      const isShortDuration = duration > 0 && duration <= 60
      
      return hasShortsKeyword || isShortDuration
    }

    // Highlight 형식으로 변환하고 쇼츠 영상 필터링
    const highlights = detailData.items
      .filter((item: any) => !isShorts(item)) // 쇼츠 영상 제외
      .map((item: any) => {
        const snippet = item.snippet
        const stats = item.statistics
        const publishedDate = new Date(snippet.publishedAt)
        const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)

        return {
          id: item.id,
          title: snippet.title,
          thumbnail: snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url || "",
          videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
          date: snippet.publishedAt.split("T")[0],
          views: parseInt(stats.viewCount || "0"),
          category: (daysSincePublished < 7 ? "recent" : "legend") as "recent" | "legend",
          teamCode: teamCode || undefined,
        }
      })

    // sortOrder에 따라 클라이언트에서 정렬
    if (sortOrder === "date") {
      // 최신순: 날짜 기준 내림차순
      highlights.sort((a: { date: string }, b: { date: string }) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } else if (sortOrder === "relevance") {
      // 인기순: 조회수 기준 내림차순
      highlights.sort((a: { views: number }, b: { views: number }) => b.views - a.views)
    }

    // 요청한 개수만큼만 반환
    const finalHighlights = highlights.slice(0, requestedCount)

    return NextResponse.json({ data: finalHighlights, error: false })
  } catch (error) {
    console.error("YouTube API 호출 실패:", error)
    // 에러 발생 시 에러 정보와 함께 빈 배열 반환
    return NextResponse.json({ 
      error: true, 
      message: "YouTube 데이터를 가져오는데 실패했습니다.",
      data: [] 
    })
  }
}

