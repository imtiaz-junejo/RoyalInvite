"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { themes, fonts } from "@/lib/themes"
import type { ThemeKey, FontKey } from "@/lib/themes"

export interface InvitationData {
  brideName: string
  groomName: string
  title: string
  headline?: string
  secondaryHeadline?: string
  eventDate: string
  eventTime: string
  venueName: string
  venueAddress?: string
  googleMapsLink?: string
  message?: string
  secondaryMessage?: string
  storyTitle?: string
  storyText?: string
  secondaryStoryTitle?: string
  secondaryStoryText?: string
  galleryText?: string
  eventSeriesTitle?: string
  eventSeriesText?: string
  mealOptions?: string
  scheduleText?: string
  primaryLanguage?: "en" | "hi" | "ur" | "mr" | "gu"
  secondaryLanguage?: "en" | "hi" | "ur" | "mr" | "gu" | ""
  rsvpContact?: string
  rsvpDeadline?: string
  dressCode?: string
  familyNames?: string
  coverImage?: string
  musicTitle?: string
  musicArtist?: string
  musicUrl?: string
  fontKey?: FontKey
  themeKey?: ThemeKey
}

interface InvitationCardProps {
  data: InvitationData
  onOpenChange?: (open: boolean) => void
  standalone?: boolean
}

export function InvitationCard({ data, onOpenChange, standalone = false }: InvitationCardProps) {
  const [open, setOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const theme = themes[data.themeKey || "gold"]
  const font = fonts[data.fontKey || "cormorant"]
  const accent = theme.accent
  const accent2 = theme.accent2

  const formatDate = useCallback(
    (dateVal: string) => {
      if (!dateVal) return { short: "—", full: "—" }
      const d = new Date(dateVal + "T12:00:00")
      if (isNaN(d.getTime())) return { short: "—", full: "—" }
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ]
      const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      ]
      const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"]
        const v = n % 100
        return s[(v - 20) % 10] || s[v] || s[0]
      }
      return {
        short: `${months[d.getMonth()].toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`,
        full: `${days[d.getDay()].toUpperCase()}, ${months[d.getMonth()].toUpperCase()} ${d.getDate()}${getOrdinal(d.getDate())}, ${d.getFullYear()}`,
      }
    },
    []
  )

  const dateFormatted = formatDate(data.eventDate)

  // Mouse tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (open || !stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      setTilt({ x: dy * -12, y: dx * 12 })
    },
    [open]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      onOpenChange?.(next)
      return next
    })
  }, [onOpenChange])

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-5 rounded-[30px] pointer-events-none z-[-1]"
        style={{
          boxShadow: `0 0 60px ${theme.glow}, 0 0 120px ${theme.glow}`,
          opacity: 0,
        }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Card stage */}
      <div
        ref={stageRef}
        className="perspective-[1200px] cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleOpen}
        style={{ perspective: "1200px" }}
      >
        <div
          ref={cardRef}
          className="relative w-full pb-[140%]"
          style={{
            transformStyle: "preserve-3d",
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Cover */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden z-10 flex flex-col items-center justify-center border border-[rgba(201,168,76,0.25)] card-shadow"
            style={{
              background: data.coverImage
                ? `url('${data.coverImage}') center/cover no-repeat`
                : theme.cardFront,
              transformOrigin: "left center",
            }}
            animate={{
              rotateY: open ? -160 : 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.77, 0, 0.175, 1],
            }}
          >
            {/* Overlay for cover image */}
            {data.coverImage && (
              <div className="absolute inset-0 bg-black/55 z-0" />
            )}

            {/* Corner decorations */}
            {["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 left-4 -rotate-90", "bottom-4 right-4 rotate-180"].map(
              (pos, i) => (
                <span key={i} className={`absolute ${pos} text-2xl opacity-50 z-[1]`} style={{ color: accent }}>
                  ❧
                </span>
              )
            )}

            {/* Cover content */}
            <motion.div className="relative z-10 flex flex-col items-center gap-2 px-5">
              <motion.span className="text-4xl" style={{ color: accent }} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                ✦
              </motion.span>

              {/* Divider */}
              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: accent }} />
                <span className="text-[10px]" style={{ color: accent }}>◆</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: accent }} />
              </div>

              <p className="font-cinzel text-[11px] tracking-[4px] uppercase text-center" style={{ color: accent2 }}>
                {data.title || "Wedding Invitation"}
              </p>

              <p
                className="font-cormorant text-[clamp(28px,6vw,42px)] font-light italic text-center leading-tight text-glow"
                style={{
                  fontFamily: font.style,
                  color: accent,
                  textShadow: `0 0 30px ${theme.glow}`,
                }}
              >
                {data.brideName || "Bride"}
                <span className="text-[0.6em] not-italic opacity-70 block">&amp;</span>
                {data.groomName || "Groom"}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: accent }} />
                <span className="text-[10px]" style={{ color: accent }}>◆</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: accent }} />
              </div>

              <p className="font-cinzel text-[clamp(10px,2vw,12px)] tracking-[3px] text-center" style={{ color: accent2 }}>
                {dateFormatted.short}
              </p>
            </motion.div>

            <p className="absolute bottom-6 font-cinzel text-[9px] tracking-[2px] opacity-60 z-10" style={{ color: accent2 }}>
              {open ? "" : "TAP TO OPEN"}
            </p>
          </motion.div>

          {/* Inner card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-y-auto z-5 card-inner-scroll"
            style={{
              background: theme.cardInner,
              color: theme.textDark,
            }}
          >
            <div className="relative p-8 pb-12 min-h-full" style={{ color: theme.textDark }}>
              {/* Inner border frame */}
              <div className="absolute inset-3 border rounded-lg pointer-events-none" style={{ borderColor: "rgba(139,105,20,0.2)" }} />

              {/* Ornament */}
              <InnerSection delay={0.4} theme={theme}>
                <span className="text-2xl block mb-2" style={{ color: accent }}>✦</span>
                {data.familyNames && (
                  <p className="font-cinzel text-[9px] tracking-[3px] uppercase opacity-70 text-center mb-1" style={{ color: accent }}>
                    {data.familyNames}
                  </p>
                )}
                <div className="inner-divider my-2" style={{ color: accent }} />
                <p className="font-cinzel text-[8px] tracking-[2px] uppercase opacity-50 text-center" style={{ color: accent }}>
                  joyfully request the honor of your presence
                </p>
              </InnerSection>

              {/* Names */}
              <InnerSection delay={0.55} theme={theme}>
                <p
                  className="font-cormorant text-[32px] font-light italic leading-tight text-center"
                  style={{ fontFamily: font.style, color: accent }}
                >
                  {data.brideName}
                  <br />
                  <span className="text-[0.5em] opacity-70">&amp;</span>
                  <br />
                  {data.groomName}
                </p>
                <div className="inner-divider my-3" style={{ color: accent }} />
              </InnerSection>

              {/* Message */}
              {data.message && (
                <InnerSection delay={0.7} theme={theme}>
                  <p className="font-cormorant text-sm italic leading-relaxed text-center px-2 opacity-80" style={{ color: "rgba(26,18,8,0.8)" }}>
                    {data.message}
                  </p>
                </InnerSection>
              )}

              {/* Details */}
              <InnerSection delay={0.85} theme={theme}>
                <DetailRow icon="📅" text={dateFormatted.full} theme={theme} />
                <DetailRow icon="🕐" text={`${data.eventTime} — CEREMONY`} theme={theme} />
                <DetailRow icon="📍" text={data.venueName} subtext={data.venueAddress} googleMapsLink={data.googleMapsLink} theme={theme} />
              </InnerSection>

              {/* Message */}
              {data.headline && (
                <InnerSection delay={1.0} theme={theme}>
                  <p className="font-cinzel text-[9px] tracking-[3px] uppercase opacity-70 text-center mb-2" style={{ color: accent }}>
                    {data.headline}
                  </p>
                </InnerSection>
              )}

              {/* RSVP */}
              {(data.rsvpContact || data.rsvpDeadline) && (
                <InnerSection delay={1.15} theme={theme}>
                  <p className="font-cinzel text-[9px] tracking-[3px] uppercase opacity-70 text-center mb-2" style={{ color: accent }}>
                    RSVP
                  </p>
                  <div className="inner-divider mb-3" style={{ color: accent }} />
                  <div
                    className="rounded-[10px] p-4 border"
                    style={{
                      background: "rgba(139,105,20,0.08)",
                      borderColor: "rgba(139,105,20,0.2)",
                    }}
                  >
                    {data.rsvpDeadline && (
                      <p className="font-cinzel text-[10px] tracking-wider text-center mb-2" style={{ color: accent }}>
                        {data.rsvpDeadline}
                      </p>
                    )}
                    {data.rsvpContact && (
                      <p className="font-cinzel text-[10px] tracking-wider text-center" style={{ color: accent }}>
                        📞 {data.rsvpContact}
                      </p>
                    )}
                  </div>
                  {data.dressCode && (
                    <p className="text-xs italic text-center mt-3 opacity-65" style={{ color: "rgba(26,18,8,0.65)" }}>
                      Dress Code: {data.dressCode}
                    </p>
                  )}
                </InnerSection>
              )}

              {/* Footer */}
              <InnerSection delay={1.3} theme={theme}>
                <div className="inner-divider mb-3" style={{ color: accent }} />
                <p className="font-cormorant italic text-base text-center" style={{ color: accent }}>
                  With love & gratitude
                </p>
                <span className="text-lg block mt-2 text-center" style={{ color: accent }}>♡</span>
              </InnerSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InnerSection({ delay, theme, children }: { delay: number; theme: any; children: React.ReactNode }) {
  return (
    <motion.div
      className="text-center mb-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

function DetailRow({ icon, text, subtext, googleMapsLink, theme }: { icon: string; text: string; subtext?: string; googleMapsLink?: string; theme: any }) {
  return (
    <div className="flex items-center justify-center gap-3 my-1.5">
      <span className="text-sm">{icon}</span>
      <div>
        <p className="font-cinzel text-[11px] tracking-wide" style={{ color: theme.textDark }}>
          {text}
        </p>
        {subtext && (
          <p className="text-[11px] opacity-60 mt-0.5" style={{ color: "rgba(26,18,8,0.6)" }}>
            {subtext}
          </p>
        )}
        {googleMapsLink && (
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1.5 text-[10px] tracking-wide font-cinzel uppercase transition-opacity hover:opacity-100"
            style={{ color: theme.accent }}
          >
            📍 View on Map
          </a>
        )}
      </div>
    </div>
  )
}
