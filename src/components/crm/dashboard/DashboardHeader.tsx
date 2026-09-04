'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Clock, CalendarDays } from 'lucide-react'

interface DashboardHeaderProps {
  userName: string
  userRole?: string
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHeader({ userName, userRole }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())

    // Update time every 10 seconds for real-time responsiveness
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  // Safe fallback values during SSR / initial hydration
  const dateObj = currentTime ?? new Date()
  const hours = mounted && currentTime ? currentTime.getHours() : 12
  const greeting = getGreeting(hours)

  // Format date: "Friday, 4 Sep 2026"
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Format live time: "10:39 PM"
  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#162032]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 md:rounded-[28px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,180,0,0.18),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.16),transparent_30%)]" />
      <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F4B400]/30 bg-[#F4B400]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F4B400]">
            <Sparkles className="h-3.5 w-3.5" />
            Luxury CRM Workspace
            {userRole && (
              <span className="ml-1 rounded-full bg-[#F4B400]/20 px-2 py-0.5 text-[9px] font-black tracking-wider text-[#F4B400]">
                {userRole}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
            {greeting}, {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Track premium enquiries, site visits, follow-ups, agent performance, and conversion momentum from one beautiful control room.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Date Box */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-gray-300 shadow-inner shadow-white/5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <CalendarDays className="h-3 w-3 text-[#F4B400]" />
              <span>Today</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="mt-1 font-semibold text-white">
              {mounted ? formattedDate : 'Loading today…'}
            </p>
          </div>

          {/* Live Time Box */}
          <div className="hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-gray-300 shadow-inner shadow-white/5 sm:block sm:px-5 sm:py-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <Clock className="h-3 w-3 text-[#F4B400]" />
              <span>Live Clock</span>
            </div>
            <p className="mt-1 font-semibold text-white tracking-wider">
              {mounted ? formattedTime : '--:--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
