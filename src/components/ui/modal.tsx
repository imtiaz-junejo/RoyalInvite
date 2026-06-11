"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useCallback, useEffect } from "react"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, subtitle, children }: ModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    },
    [onOpenChange]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [handleEsc])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-5 pointer-events-none"
          >
            <div className="relative bg-bg2 border border-gold-400/30 rounded-[20px] p-10 max-w-md w-full pointer-events-auto shadow-2xl">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-5 text-text/50 hover:text-text transition-opacity"
              >
                <X size={20} />
              </button>
              <h2 className="font-cinzel text-lg tracking-widest text-accent text-center mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-text/60 text-center mb-7 tracking-wide">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
