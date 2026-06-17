"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { showToast } from "@/components/ui/toast"

interface UpgradeButtonClientProps {
  targetTier: "free" | "pro"
  currentTier: "free" | "pro"
  label: string
  popular: boolean
}

export function UpgradeButtonClient({ targetTier, currentTier, label, popular }: UpgradeButtonClientProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: targetTier }),
      })

      const data = await res.json()

      if (res.ok) {
        showToast(data.message || `Successfully ${targetTier === "pro" ? "upgraded" : "downgraded"}!`)
        router.refresh()
      } else {
        showToast(data.error || "Failed to update plan", "error")
      }
    } catch {
      showToast("Failed to update plan", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        popular
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:opacity-95"
          : "border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"
      }`}
    >
      {loading ? "Processing..." : label}
    </button>
  )
}
