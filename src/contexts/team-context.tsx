"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Team } from "@/types"
import { TEAMS } from "@/constants/teams"

interface TeamContextType {
  selectedTeam: Team
  setSelectedTeam: (team: Team) => void
  favoriteTeams: Team[]
  addFavoriteTeam: (team: Team) => void
  removeFavoriteTeam: (teamCode: string) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [selectedTeam, setSelectedTeam] = useState<Team>(TEAMS[0]) // Default to SSG
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([])

  useEffect(() => {
    // Load from localStorage
    const savedTeam = localStorage.getItem("selectedTeam")
    const savedFavorites = localStorage.getItem("favoriteTeams")

    if (savedTeam) {
      const team = TEAMS.find((t) => t.code === savedTeam)
      if (team) setSelectedTeam(team)
    }

    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites)
      setFavoriteTeams(favorites)
    }
  }, [])

  const handleSetSelectedTeam = (team: Team) => {
    setSelectedTeam(team)
    localStorage.setItem("selectedTeam", team.code)
  }

  const addFavoriteTeam = (team: Team) => {
    const newFavorites = [...favoriteTeams, team]
    setFavoriteTeams(newFavorites)
    localStorage.setItem("favoriteTeams", JSON.stringify(newFavorites))
  }

  const removeFavoriteTeam = (teamCode: string) => {
    const newFavorites = favoriteTeams.filter((team) => team.code !== teamCode)
    setFavoriteTeams(newFavorites)
    localStorage.setItem("favoriteTeams", JSON.stringify(newFavorites))
  }

  return (
    <TeamContext.Provider
      value={{
        selectedTeam,
        setSelectedTeam: handleSetSelectedTeam,
        favoriteTeams,
        addFavoriteTeam,
        removeFavoriteTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider")
  }
  return context
}
