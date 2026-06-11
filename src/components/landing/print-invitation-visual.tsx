/** Print & share collage — envelope, floral card, mobile preview */
export function PrintInvitationVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md select-none py-4" aria-hidden>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-100/90 to-rose-100/60 blur-2xl" />
      <div className="pointer-events-none absolute right-4 top-8 h-40 w-40 rounded-full bg-gradient-to-br from-amber-50/80 to-orange-100/50 blur-xl" />

      <div className="relative flex items-center justify-center">
        <div className="absolute -left-2 top-16 z-0 h-36 w-52 -rotate-6 rounded-sm border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 shadow-md">
          <div
            className="absolute inset-x-0 top-0 h-16 origin-top border-b border-neutral-100 bg-neutral-50/80"
            style={{ clipPath: "polygon(0 0, 50% 70%, 100% 0)" }}
          />
        </div>

        <div className="relative z-10 w-[min(100%,240px)] rotate-2 rounded-xl border-4 border-double border-rose-900/30 bg-[#faf6ef] p-4 shadow-2xl shadow-neutral-900/15">
          <div className="rounded-lg border border-rose-800/20 bg-gradient-to-b from-rose-950 to-rose-900 px-3 py-5 text-center">
            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-rose-100/90">
              Save the date for the wedding of
            </p>
            <p className="mt-3 font-serif text-sm font-semibold leading-snug text-white">
              Alex <span className="text-rose-200/80">&</span> Jordan
            </p>
            <p className="mt-2 text-[10px] font-medium tracking-wider text-rose-100/80">NOV 08 2026</p>
          </div>
          <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
            <span aria-hidden>🖨</span> Share link
          </div>
        </div>

        <div className="absolute -right-2 top-0 z-20 w-24 rounded-2xl border-4 border-neutral-800 bg-neutral-900 p-1 shadow-xl">
          <div className="aspect-[9/16] overflow-hidden rounded-xl bg-gradient-to-b from-rose-900 to-rose-950">
            <div className="flex h-full flex-col items-center justify-center p-2 text-center">
              <p className="text-[6px] text-rose-100/80">3D reveal</p>
              <p className="mt-1 font-serif text-[9px] text-white">Alex & Jordan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
