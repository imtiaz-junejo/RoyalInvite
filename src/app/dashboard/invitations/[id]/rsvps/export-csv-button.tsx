"use client"

import { Download } from "lucide-react"
import { formatEventDate } from "@/lib/ssr"

export default function ExportCsvButton({ rsvps, slug }: { rsvps: any[]; slug: string }) {
  const statusLabel = (status: string) => {
    switch (status) {
      case "attending":
        return "Attending"
      case "not_attending":
        return "Not Attending"
      case "maybe":
        return "Maybe"
      default:
        return status
    }
  }

  return (
    <button
      onClick={() => {
        const csv = [
          ["Name", "Email", "Guest Count", "Meal Preference", "WhatsApp", "WhatsApp Consent", "Status", "Message", "Date"].join(","),
          ...rsvps.map((r) =>
            [
              `"${r.guestName}"`,
              `"${r.guestEmail || ""}"`,
              r.guestCount || 1,
              `"${r.mealPreference || ""}"`,
              `"${r.guestWhatsapp || ""}"`,
              r.whatsappConsent ? "Yes" : "No",
              statusLabel(r.attendanceStatus),
              `"${(r.message || "").replace(/"/g, '""')}"`,
              formatEventDate(r.createdAt),
            ].join(",")
          ),
        ].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rsvp-${slug}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }}
      className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
    >
      <Download size={12} /> Export CSV
    </button>
  )
}
