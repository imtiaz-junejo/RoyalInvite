"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface MusicPlayerProps {
  title?: string
  artist?: string
  url?: string
  accent?: string
  borderColor?: string
  bgAccent?: string
}

export function MusicPlayer({ title = "A Thousand Years", artist = "Christina Perri", url, accent = "#c9a84c", borderColor = "rgba(201,168,76,0.3)", bgAccent = "rgba(255,255,255,0.12)" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.loop = true
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && url) {
      audioRef.current.src = url
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [url, isPlaying])

  const togglePlay = useCallback(() => {
    if (!audioRef.current?.src || audioRef.current.src === window.location.href) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(audioRef.current.muted)
    }
  }, [])

  const hasUrl = url && url.length > 0

  return (
    <div
      className={cn(
        "flex items-center gap-3 backdrop-blur-[15px] border rounded-[50px] px-5 py-2.5 relative z-[2] transition-colors duration-500",
        isPlaying && "is-playing"
      )}
      style={{ background: bgAccent, borderColor: accent, borderWidth: "1px" }}
    >
      <span className="text-lg animate-spin-slow" style={{ color: accent }}>♪</span>
      <div className="flex-1 min-w-0">
        <p className="font-cinzel text-[11px] tracking-wide truncate" style={{ color: accent }}>
          {title}
        </p>
        <p className="text-[9px] opacity-50 tracking-wider" style={{ color: "var(--text-color, #fdf8f0)" }}>
          {artist}
        </p>
      </div>

      {/* Wave bars */}
      <div className="flex items-end gap-[2px] h-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm transition-opacity duration-300"
            style={{
              background: accent,
              height: [6, 12, 8, 14, 6][i],
              animation: `wave 0.8s ease-in-out infinite`,
              animationDelay: `${[0, 0.1, 0.2, 0.15, 0.25][i]}s`,
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
          style={{
            borderColor: accent,
            color: accent,
            background: isPlaying ? accent : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!isPlaying) (e.target as HTMLElement).style.background = accent + "20"
          }}
          onMouseLeave={(e) => {
            if (!isPlaying) (e.target as HTMLElement).style.background = "transparent"
          }}
          disabled={!hasUrl}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
        </button>
        {hasUrl && (
          <button onClick={toggleMute} className="text-[10px] opacity-50 hover:opacity-100 transition-opacity" style={{ color: accent }}>
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
      </div>

      {!hasUrl && (
        <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] opacity-30 whitespace-nowrap" style={{ color: "var(--text-color, #fdf8f0)" }}>
          No music URL set
        </p>
      )}
    </div>
  )
}
