"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

let toastTimeout: NodeJS.Timeout | null = null
let toastQueue: { message: string; type: "success" | "error" | "info" }[] = []
let setToastFn: ((t: { message: string; type: "success" | "error" | "info" } | null) => void) | null = null

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  toastQueue.push({ message, type })
  if (setToastFn) {
    setToastFn(toastQueue.shift() || null)
    clearTimeout(toastTimeout!)
    toastTimeout = setTimeout(() => {
      setToastFn?.(null)
      if (toastQueue.length > 0) {
        setToastFn?.(toastQueue.shift() || null)
      }
    }, 2800)
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)

  setToastFn = setToast

  return (
    <>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-[9999] rounded-full border border-accent bg-surface px-6 py-3.5 shadow-2xl"
          >
            <span className="text-accent font-cinzel text-xs tracking-wider">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
