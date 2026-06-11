/** Templates panel + photo invitation — planner / catalog workflow */
export function PlannerWorkspaceVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg select-none" aria-hidden>
      <div className="pointer-events-none absolute -left-8 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative min-h-[320px]">
        <div className="absolute left-0 top-8 z-10 w-36 rounded-xl border border-neutral-100 bg-white p-2.5 shadow-lg shadow-neutral-900/10">
          <p className="text-[10px] font-bold text-neutral-800">Templates</p>
          <div className="mt-2 flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[9px] text-neutral-400">
            <span>🔍</span> Search
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-[#1a1208] to-[#2d2010]" />
            <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-[#2d0f1c] to-[#5c1f38] ring-2 ring-brand-400 ring-offset-1" />
            <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-[#ece5d5] to-[#ddd3ba]" />
            <div className="aspect-[3/4] rounded-md bg-gradient-to-br from-amber-200 to-orange-300" />
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-4 w-[min(100%,260px)] rotate-1 overflow-hidden rounded-2xl shadow-2xl shadow-neutral-900/20">
          <div className="aspect-[3/4] bg-gradient-to-b from-amber-300 via-orange-400 to-rose-500">
            <div className="flex h-full flex-col justify-between p-4 text-white">
              <p className="text-center font-serif text-lg font-semibold drop-shadow-md">Tony & Amy</p>
              <div className="rounded-lg border-2 border-white/80 bg-white/20 p-2 backdrop-blur-sm">
                <p className="text-center text-[10px] font-semibold">08/27/2026 @ 5 PM</p>
                <p className="mt-1 text-center text-[8px] opacity-90">Reception to follow · RSVP in invite</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-20 top-2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg">
          <span className="text-sm">✦</span>
        </div>
        <div className="absolute right-8 top-12 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
          <span className="text-xs">♥</span>
        </div>
        <div className="absolute bottom-16 left-24 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
          <span className="text-[10px]">👍</span>
        </div>
      </div>
    </div>
  )
}
