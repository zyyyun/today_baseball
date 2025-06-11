"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTeam } from "@/contexts/team-context"
import { TEAMS } from "@/constants/teams"
import Image from "next/image"

export default function TeamSelector() {
  const { selectedTeam, setSelectedTeam } = useTeam()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        style={{ borderLeft: `4px solid ${selectedTeam.color}` }}
      >
        <Image
          src={selectedTeam.logoUrl || "/placeholder.svg"}
          alt={selectedTeam.name}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="font-semibold text-gray-800">{selectedTeam.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-500 px-3 py-2">팀 선택</div>
            {TEAMS.map((team) => (
              <button
                key={team.code}
                onClick={() => {
                  setSelectedTeam(team)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                  selectedTeam.code === team.code ? "bg-gray-100" : ""
                }`}
              >
                <Image
                  src={team.logoUrl || "/placeholder.svg"}
                  alt={team.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="font-medium">{team.name}</span>
                {selectedTeam.code === team.code && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: team.color }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
