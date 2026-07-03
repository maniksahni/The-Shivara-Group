import React from 'react'

function SkeletonCard() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#162032]/80 p-4 shadow-xl shadow-black/15 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/5" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
        <div className="h-7 w-20 animate-pulse rounded-full bg-white/5" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-white/[0.06]" />
        <div className="h-16 animate-pulse rounded-2xl bg-white/[0.06]" />
      </div>
    </div>
  )
}

export default function LeadsLoading() {
  return (
    <div className="min-h-screen">
      <div className="rounded-[28px] border border-white/10 bg-[#162032]/80 px-5 py-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-7">
        <div className="h-3 w-44 animate-pulse rounded-full bg-[#F4B400]/20" />
        <div className="mt-4 h-9 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-52 animate-pulse rounded-full bg-white/5" />
      </div>

      <div className="py-6">
        <div className="mb-6 h-16 animate-pulse rounded-[24px] border border-white/10 bg-[#162032]/60" />
        <div className="grid gap-3 md:hidden">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="hidden overflow-hidden rounded-[26px] border border-white/10 bg-[#162032]/70 p-5 shadow-2xl shadow-black/20 md:block">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <div key={cellIndex} className="h-5 animate-pulse rounded-full bg-white/[0.06]" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
