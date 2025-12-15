import type { Team } from "@/types"

export const TEAMS: Team[] = [
  {
    code: "SSG",
    name: "SSG 랜더스",
    color: "#E41E2B",
    logoUrl: "/teams/ssg_sym.svg",
  },
  {
    code: "LG",
    name: "LG 트윈스",
    color: "#C30452",
    logoUrl: "/teams/lg_sym.svg",
  },
  {
    code: "KT",
    name: "KT 위즈",
    color: "#000000",
    logoUrl: "/teams/kt_sym.svg",
  },
  {
    code: "KIA",
    name: "KIA 타이거즈",
    color: "#EA0029",
    logoUrl: "/teams/kia_sym.svg",
  },
  {
    code: "NC",
    name: "NC 다이노스",
    color: "#315288",
    logoUrl: "/teams/nc_sym.svg",
  },
  {
    code: "DOOSAN",
    name: "두산 베어스",
    color: "#131230",
    logoUrl: "/teams/doosan_sym.svg",
  },
  {
    code: "SAMSUNG",
    name: "삼성 라이온즈",
    color: "#074CA1",
    logoUrl: "/teams/samsung_sym.svg",
  },
  {
    code: "LOTTE",
    name: "롯데 자이언츠",
    color: "#041E42",
    logoUrl: "/teams/lotte_sym.svg",
  },
  {
    code: "KIWOOM",
    name: "키움 히어로즈",
    color: "#570514",
    logoUrl: "/teams/kiwoom_sym.svg",
  },
  {
    code: "HANWHA",
    name: "한화 이글스",
    color: "#FF6600",
    logoUrl: "/teams/hanwha_sym.svg",
  },
]

export const getTeamByCode = (code: string): Team | undefined => {
  return TEAMS.find((team) => team.code === code)
}

// KBO 공식 API 팀 코드를 프로젝트 팀 코드로 매핑
export const mapKboTeamCodeToProjectCode = (kboCode: string): string => {
  const mapping: { [key: string]: string } = {
    LG: "LG",
    HH: "HANWHA", // 한화
    SK: "SSG", // SSG 랜더스
    SS: "SAMSUNG", // 삼성
    NC: "NC",
    KT: "KT",
    LT: "LOTTE", // 롯데
    HT: "KIA", // KIA 타이거즈
    OB: "DOOSAN", // 두산
    WO: "KIWOOM", // 키움
  }
  return mapping[kboCode] || kboCode
}

// 프로젝트 팀 코드를 KBO 공식 API 팀 코드로 매핑
export const mapProjectCodeToKboTeamCode = (projectCode: string): string => {
  const mapping: { [key: string]: string } = {
    LG: "LG",
    HANWHA: "HH",
    SSG: "SK",
    SAMSUNG: "SS",
    NC: "NC",
    KT: "KT",
    LOTTE: "LT",
    KIA: "HT",
    DOOSAN: "OB",
    KIWOOM: "WO",
  }
  return mapping[projectCode] || projectCode
}

// KBO 팀 이름으로 팀 찾기
export const getTeamByName = (name: string): Team | undefined => {
  // 정확한 이름 매칭
  let team = TEAMS.find((t) => t.name === name)
  if (team) return team

  // 부분 매칭 (예: "한화" → "한화 이글스")
  const nameMappings: { [key: string]: string } = {
    한화: "한화 이글스",
    SSG: "SSG 랜더스",
    LG: "LG 트윈스",
    KT: "KT 위즈",
    KIA: "KIA 타이거즈",
    기아: "KIA 타이거즈",
    NC: "NC 다이노스",
    두산: "두산 베어스",
    삼성: "삼성 라이온즈",
    롯데: "롯데 자이언츠",
    키움: "키움 히어로즈",
  }

  const mappedName = nameMappings[name] || name
  return TEAMS.find((t) => t.name.includes(mappedName) || mappedName.includes(t.name))
}