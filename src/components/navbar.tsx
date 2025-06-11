"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Play, User } from "lucide-react"
import TeamSelector from "./team-selector"
import { useTeam } from "@/contexts/team-context"

export default function Navbar() {
  const pathname = usePathname()
  const { selectedTeam } = useTeam()

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/schedule", label: "경기일정", icon: Calendar },
    { href: "/highlights", label: "하이라이트", icon: Play },
    { href: "/mypage", label: "마이페이지", icon: User },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: selectedTeam.color }}
            >
              KBO
            </div>
            <span className="font-bold text-xl text-gray-900">팬앱</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={isActive ? { backgroundColor: selectedTeam.color } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Team Selector */}
          <TeamSelector />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${
                  isActive ? "text-current" : "text-gray-600"
                }`}
                style={isActive ? { color: selectedTeam.color } : {}}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
