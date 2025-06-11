import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TeamProvider } from "@/contexts/team-context"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KBO 팬앱 - SSG 랜더스",
  description: "KBO 리그 경기 일정, 하이라이트, 팀 정보를 한눈에",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TeamProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
          </div>
        </TeamProvider>
      </body>
    </html>
  )
}
