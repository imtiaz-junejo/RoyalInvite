"use client"

import { useEffect, useRef } from "react"

interface ParticleCanvasProps {
  accentColor?: string
  className?: string
}

export function ParticleCanvas({ accentColor = "#c9a84c", className }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      twinkle: number
      twinkleSpeed: number
      type: "star" | "dot"
    }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        type: Math.random() > 0.7 ? "star" : "dot",
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.y += p.speedY
        p.x += p.speedX
        p.twinkle += p.twinkleSpeed
        p.opacity = 0.2 + Math.abs(Math.sin(p.twinkle)) * 0.6
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = accentColor
        if (p.type === "star") {
          const s = p.size * 1.8
          ctx.beginPath()
          ctx.moveTo(p.x, p.y - s)
          ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3)
          ctx.lineTo(p.x + s, p.y)
          ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3)
          ctx.lineTo(p.x, p.y + s)
          ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3)
          ctx.lineTo(p.x - s, p.y)
          ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [accentColor])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 opacity-70 ${className || ""}`}
    />
  )
}
