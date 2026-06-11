"use client"

import { useState, useEffect } from "react"

interface CountdownProps {
  eventDate: string
  accent?: string
  bgAccent?: string
  borderColor?: string
}

export function Countdown({ eventDate, accent = "#c9a84c", bgAccent = "rgba(255,255,255,0.12)", borderColor = "rgba(201,168,76,0.3)" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: "—", hours: "—", mins: "—", secs: "—" })

  useEffect(() => {
    if (!eventDate) return
    const target = new Date(eventDate + "T00:00:00")

    const update = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft({ days: "0", hours: "0", mins: "0", secs: "0" })
        return
      }
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
        mins: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
        secs: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0"),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [eventDate])

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.mins },
    { label: "Seconds", value: timeLeft.secs },
  ]

  return (
    <div className="flex gap-3 justify-center flex-wrap relative z-[2]">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center backdrop-blur-[10px] border border-[rgba(201,168,76,0.3)] rounded-xl px-5 py-3.5 min-w-[70px]"
          style={{ background: bgAccent, borderColor }}
        >
          <span
            className="font-cinzel text-[28px] font-semibold leading-none"
            style={{ color: accent }}
          >
            {item.value}
          </span>
          <span className="text-[9px] tracking-[2px] uppercase opacity-60 mt-1" style={{ color: "var(--text-color)" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
