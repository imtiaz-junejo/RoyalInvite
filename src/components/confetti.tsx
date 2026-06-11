"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

const colors = ["#c9a84c", "#e8d5a3", "#ff69b4", "#ff6b6b", "#ffd700", "#98fb98"]

type ConfettiPiece = {
  id: number
  left: number
  bg: string
  duration: number
  delay: number
  radius: string
  rotation: number
}

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bg: colors[Math.floor(Math.random() * colors.length)]!,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.5,
    radius: Math.random() > 0.5 ? "50%" : "2px",
    rotation: Math.random() * 360,
  }))
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!active) {
      setPieces([])
      return
    }
    setPieces(generatePieces())
  }, [active])

  return (
    <AnimatePresence>
      {active &&
        pieces.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none fixed top-0 z-[9998] h-2 w-2"
            style={{
              left: `${p.left}vw`,
              background: p.bg,
              borderRadius: p.radius,
            }}
            initial={{ y: -20, rotate: p.rotation, opacity: 1 }}
            animate={{ y: "110vh", rotate: p.rotation + 720, opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            onAnimationComplete={() => {
              if (p.id === 59) onComplete?.()
            }}
          />
        ))}
    </AnimatePresence>
  )
}

export function useConfetti() {
  const triggerConfetti = (callback?: () => void) => {
    const container = document.getElementById("confetti-container")
    if (!container) return
    container.innerHTML = ""

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div")
      piece.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -20px;
        width: 8px; height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        pointer-events: none;
        z-index: 9998;
        animation: confettiFall ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards;
      `
      container.appendChild(piece)
      piece.addEventListener("animationend", () => piece.remove())
    }
    callback?.()
  }

  return { triggerConfetti }
}
