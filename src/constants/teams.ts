import type { Team } from "@/types"

export const TEAMS: Team[] = [
  {
    code: "SSG",
    name: "SSG 랜더스",
    color: "#E41E2B",
    logoUrl: "/teams/ssg.svg",
  },
  {
    code: "LG",
    name: "LG 트윈스",
    color: "#C30452",
    logoUrl: "/teams/lg.svg",
  },
  {
    code: "KT",
    name: "KT 위즈",
    color: "#FF6600",
    logoUrl: "/teams/kt.svg",
  },
  {
    code: "KIA",
    name: "KIA 타이거즈",
    color: "#EA0029",
    logoUrl: "/teams/kia.svg",
  },
  {
    code: "NC",
    name: "NC 다이노스",
    color: "#315288",
    logoUrl: "/teams/nc.svg",
  },
  {
    code: "DOOSAN",
    name: "두산 베어스",
    color: "#131230",
    logoUrl: "/teams/doosan.svg",
  },
  {
    code: "SAMSUNG",
    name: "삼성 라이온즈",
    color: "#074CA1",
    logoUrl: "/teams/samsung.svg",
  },
  {
    code: "LOTTE",
    name: "롯데 자이언츠",
    color: "#041E42",
    logoUrl: "/teams/lotte.svg",
  },
  {
    code: "KIWOOM",
    name: "키움 히어로즈",
    color: "#570514",
    logoUrl: "/teams/kiwoom.svg",
  },
  {
    code: "HANWHA",
    name: "한화 이글스",
    color: "#FF6600",
    logoUrl: "/teams/hanwha.svg",
  },
]

export const getTeamByCode = (code: string): Team | undefined => {
  return TEAMS.find((team) => team.code === code)
}
