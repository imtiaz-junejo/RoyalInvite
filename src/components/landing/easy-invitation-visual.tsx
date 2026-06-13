import { Check, Search, X } from "lucide-react"

const terracotta = "#894c38"
const cardBg = "#e8ddd4"

function BlobTop() {
  return (
    <svg viewBox="0 0 200 80" className="absolute -left-2 -top-1 w-[88%]" aria-hidden>
      <path
        d="M-10 45 C30 5 70 0 110 18 C150 36 175 28 210 42 L210 0 L-10 0 Z"
        fill={terracotta}
      />
      <path
        d="M120 8 C145 2 165 12 185 28 C175 22 155 18 130 22 Z"
        fill={terracotta}
        opacity="0.85"
      />
    </svg>
  )
}

function BlobBottom() {
  return (
    <svg viewBox="0 0 200 100" className="absolute -bottom-1 -right-1 w-[95%]" aria-hidden>
      <path
        d="M-10 55 C40 95 90 105 140 88 C175 76 195 82 210 70 L210 110 L-10 110 Z"
        fill={terracotta}
      />
      <ellipse cx="55" cy="78" rx="28" ry="18" fill={terracotta} opacity="0.9" />
      <ellipse cx="150" cy="85" rx="22" ry="14" fill={terracotta} opacity="0.75" />
    </svg>
  )
}

function BlobThumb({ className }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md bg-[#f5f0eb] ${className ?? ""}`}>
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <path d="M0 20 C12 4 28 2 40 14 C48 22 48 36 36 44 L0 44 Z" fill={terracotta} />
        <ellipse cx="32" cy="12" rx="10" ry="8" fill={terracotta} opacity="0.8" />
      </svg>
    </div>
  )
}

function InvitationCard() {
  return (
    <div
      className="relative w-[min(100%,220px)] rotate-[4deg] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
      style={{ backgroundColor: cardBg }}
    >
      <BlobTop />
      <BlobBottom />

      <div className="relative z-10 px-5 pb-8 pt-10 text-center">
        <p
          className="text-[8px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: terracotta }}
        >
          Save the date
        </p>

        <p
          className="mt-5 font-sans text-[28px] font-bold leading-[0.95] tracking-tight"
          style={{ color: terracotta }}
        >
          Natasha
          <br />
          <span className="text-[24px]">&amp; Colin</span>
        </p>

        <p
          className="mt-4 text-[15px] font-medium tracking-wide"
          style={{ color: terracotta }}
        >
          6.14.2022
        </p>

        <div className="mt-5 space-y-0.5 text-[7px] leading-snug text-neutral-600">
          <p>Bernadine Boathouse, Phoenix, Arizona</p>
          <p>Formal invitation to follow</p>
        </div>
      </div>
    </div>
  )
}

/** Adobe Express–style editor collage for the “made easy” feature row */
export function EasyInvitationVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md select-none py-6" aria-hidden>
      {/* Scattered accent dots */}
      <span className="absolute left-[18%] top-[12%] h-2 w-2 rounded-full bg-[#894c38]/70" />
      <span className="absolute left-[8%] top-[38%] h-1.5 w-1.5 rounded-full bg-neutral-300" />
      <span className="absolute right-[22%] top-[18%] h-1.5 w-1.5 rounded-full bg-neutral-300" />
      <span className="absolute bottom-[28%] left-[12%] h-2 w-2 rounded-full bg-[#894c38]/50" />
      <span className="absolute bottom-[18%] right-[10%] h-1.5 w-1.5 rounded-full bg-neutral-300" />

      <div className="relative flex items-center justify-center">
        {/* Font picker */}
        <div className="absolute left-0 top-2 z-30 w-[108px] rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.1)] sm:left-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-neutral-800">Archivo</p>
          <div className="mt-1.5 flex items-center justify-between rounded-md bg-neutral-100 px-2 py-1">
            <span className="text-[9px] font-semibold text-neutral-800">Fino Sans</span>
            <Check className="h-3 w-3 text-neutral-700" strokeWidth={2.5} />
          </div>
          <p className="mt-1.5 text-[9px] font-medium text-neutral-500">Cooper</p>
        </div>

        {/* Adobe-style logo badge */}
        <div className="absolute left-1/2 top-0 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-900 shadow-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="#fff"
              d="M13.5 4.5 19 12l-5.5 7.5h-3L16 12 10.5 4.5h3ZM6 4.5 11.5 12 6 19.5h-3L9.5 12 3 4.5h3Z"
            />
          </svg>
        </div>

        {/* Card */}
        <div className="relative z-10 pt-6">
          <InvitationCard />
          {/* Cursor */}
          <svg
            className="absolute -right-3 bottom-[38%] z-20 h-5 w-5 drop-shadow"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              fill="#fff"
              stroke="#1a1a1a"
              strokeWidth="1.2"
              d="M5 3l12 8.5-5.5.5 2.5 6.5-2.5 1-2.5-6.5L5 14V3z"
            />
          </svg>
        </div>

        {/* Design assets panel */}
        <div className="absolute bottom-0 left-0 z-30 w-[130px] rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.1)] sm:left-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-neutral-800">Design assets</span>
            <X className="h-3 w-3 text-neutral-400" strokeWidth={2} />
          </div>
          <div className="mt-2 flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1">
            <Search className="h-2.5 w-2.5 text-neutral-400" strokeWidth={2} />
            <span className="text-[8px] text-neutral-400">Search</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            <BlobThumb className="h-9" />
            <BlobThumb className="h-9" />
            <BlobThumb className="h-9" />
          </div>
        </div>

        {/* Color picker */}
        <div className="absolute bottom-6 right-0 z-30 w-[118px] rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.1)] sm:right-1">
          <div className="flex items-center gap-2">
            <span
              className="h-5 w-5 shrink-0 rounded border border-black/10"
              style={{ backgroundColor: terracotta }}
            />
            <span className="text-[10px] font-medium text-neutral-700">#894C38</span>
          </div>
          <div
            className="mt-2 h-2.5 w-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0088)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
