"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"

export default function WhatsAppUpdateForm({
  invitationId,
  recipientCount,
}: {
  invitationId: string
  recipientCount: number
}) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  async function sendUpdate() {
    setResult("")
    setError("")

    if (!message.trim()) {
      setError("Enter an update message first.")
      return
    }

    setSending(true)
    try {
      const res = await fetch(`/api/invitations/${invitationId}/updates/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload.error || "Could not send WhatsApp update.")
        return
      }

      setResult(`Sent ${payload.sent || 0} of ${payload.total || 0}. Failed: ${payload.failed || 0}.`)
      if (!payload.failed) setMessage("")
    } catch {
      setError("Could not reach the WhatsApp send API.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`${dt.card} mb-8`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className={dt.headingSm}>WhatsApp update</h2>
          <p className={`${dt.subheading} mt-1`}>
            Sends from the shared application WhatsApp number to opted-in guests for this invitation only.
          </p>
        </div>
        <span className={dt.badgePro}>{recipientCount} ready</span>
      </div>

      <div className="space-y-3">
        <Textarea
          label="Message"
          tone="light"
          value={message}
          maxLength={1000}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Example: Venue gates open at 6:30 PM. Please arrive 15 minutes early."
          className="min-h-[96px]"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {result && <p className="text-xs text-emerald-600">{result}</p>}
        <Button
          variant="primary"
          size="md"
          tone="light"
          onClick={sendUpdate}
          disabled={sending || recipientCount === 0}
        >
          <Send size={14} /> {sending ? "Sending..." : "Send WhatsApp update"}
        </Button>
      </div>
    </div>
  )
}
