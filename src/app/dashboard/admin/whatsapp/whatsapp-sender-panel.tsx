"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Link2, Loader2, QrCode, RefreshCw, Unplug, XCircle } from "lucide-react"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { formatDateTime } from "@/lib/ssr"

type SenderStatus = {
  ok?: boolean
  sessionId?: string
  status?: string
  lastEventAt?: string | null
  error?: string | null
}

type QrPayload = {
  ok?: boolean
  status?: string
  qr_data_url?: string
  status_hint?: string
  error?: string
}

export default function WhatsAppSenderPanel() {
  const [status, setStatus] = useState<SenderStatus | null>(null)
  const [qr, setQr] = useState<QrPayload | null>(null)
  const [busy, setBusy] = useState("")
  const [pollingQr, setPollingQr] = useState(false)
  const [error, setError] = useState("")

  const loadStatus = useCallback(async () => {
    setError("")
    const res = await fetch("/api/admin/whatsapp/status", { cache: "no-store" })
    const payload = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(payload.error || "Could not load sender status.")
      return
    }
    setStatus(payload)
  }, [])

  const loadQr = useCallback(
    async (showSpinner = true) => {
      setError("")
      if (showSpinner) setBusy("qr")
      try {
        const res = await fetch("/api/admin/whatsapp/qr", { cache: "no-store" })
        const payload = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(payload.error || "Could not load QR code.")
          return
        }
        setQr(payload)
        await loadStatus()
      } finally {
        if (showSpinner) setBusy("")
      }
    },
    [loadStatus]
  )

  useEffect(() => {
    loadStatus().catch(() => setError("Could not load sender status."))
  }, [loadStatus])

  useEffect(() => {
    if (!pollingQr || qr?.qr_data_url || status?.status === "connected" || status?.status === "error") return

    const timeout = window.setTimeout(() => {
      loadQr(false).catch(() => setError("Could not refresh QR code."))
    }, 2_000)

    return () => window.clearTimeout(timeout)
  }, [loadQr, pollingQr, qr?.qr_data_url, status?.status])

  async function postAction(action: "connect" | "disconnect") {
    setError("")
    setBusy(action)
    try {
      const res = await fetch(`/api/admin/whatsapp/${action}`, { method: "POST" })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(payload.error || `Could not ${action} sender.`)
        return
      }
      if (action === "disconnect") setQr(null)
      await loadStatus()
      if (action === "connect") {
        setPollingQr(true)
        await loadQr()
      }
    } finally {
      setBusy("")
    }
  }

  const connected = status?.status === "connected"
  const statusColor = connected
    ? "text-emerald-600"
    : status?.status === "qr" || status?.status === "starting"
      ? "text-amber-600"
      : "text-red-600"

  return (
    <div className={dt.tableWrap}>
      <div
        className={`flex flex-col gap-4 border-b bg-neutral-50/80 px-5 py-4 md:flex-row md:items-center md:justify-between ${dt.divider}`}
      >
        <div>
          <h2 className={dt.headingSm}>Sender session</h2>
          <p className={`${dt.subheading} mt-1 text-xs`}>
            Session ID: {status?.sessionId || "eternally-yours-main"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" tone="light" onClick={() => loadStatus()} disabled={!!busy}>
            <RefreshCw size={13} /> Refresh
          </Button>
          <Button variant="primary" size="sm" tone="light" onClick={() => postAction("connect")} disabled={!!busy || connected}>
            {busy === "connect" ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />} Connect
          </Button>
          <Button
            variant="outline"
            size="sm"
            tone="light"
            onClick={() => {
              setPollingQr(true)
              loadQr()
            }}
            disabled={!!busy || connected}
          >
            {busy === "qr" ? <Loader2 size={13} className="animate-spin" /> : <QrCode size={13} />} Show QR
          </Button>
          <Button variant="ghost" size="sm" tone="light" onClick={() => postAction("disconnect")} disabled={!!busy}>
            <Unplug size={13} /> Disconnect
          </Button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className={dt.card}>
            <div className="mb-2 flex items-center gap-2">
              {connected ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : (
                <XCircle size={18} className={statusColor} />
              )}
              <p className={`text-sm font-semibold uppercase tracking-wide ${statusColor}`}>
                {status?.status || "unknown"}
              </p>
            </div>
            <p className={`${dt.subheading} leading-relaxed`}>
              {connected
                ? "The shared application WhatsApp sender is connected and ready to send invitation-scoped reminders and updates."
                : "Connect the sender and scan the QR code with the platform-owned WhatsApp number before sending updates."}
            </p>
            {status?.lastEventAt && (
              <p className="mt-3 text-xs text-neutral-400">
                Last gateway event: {formatDateTime(status.lastEventAt)}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status?.error && <p className="text-sm text-red-600">Gateway error: {status.error}</p>}

          <div className={dt.card}>
            <h3 className={`${dt.headingSm} mb-2 text-sm`}>Operational notes</h3>
            <p className={`${dt.subheading} leading-relaxed`}>
              Keep this page admin-only. The QR belongs to the shared sender number, not to invitation hosts. If
              messages fail with session_not_connected, reconnect here and scan the QR again.
            </p>
          </div>
        </div>

        <div className={`${dt.card} flex min-h-[320px] items-center justify-center text-center`}>
          {qr?.qr_data_url ? (
            <div>
              <img
                src={qr.qr_data_url}
                alt="WhatsApp sender QR code"
                className="mx-auto mb-3 h-64 w-64 rounded-lg bg-white p-2"
              />
              <p className={dt.subheading}>Scan this QR with the application WhatsApp number.</p>
            </div>
          ) : (
            <div className="px-4">
              {pollingQr ? (
                <Loader2 size={42} className="mx-auto mb-3 animate-spin text-brand-400" />
              ) : (
                <QrCode size={42} className="mx-auto mb-3 text-brand-400" />
              )}
              <p className={`${dt.headingSm} mb-2 text-sm`}>No QR loaded</p>
              <p className={`${dt.subheading} leading-relaxed`}>
                {pollingQr
                  ? "Waiting for WhatsApp Web to generate a QR code..."
                  : qr?.status_hint || qr?.status || "Click Show QR after starting the connection."}
              </p>
              {qr?.status && <p className="mt-2 text-xs text-neutral-400">Gateway status: {qr.status}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
