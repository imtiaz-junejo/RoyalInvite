"use client"

import { useMemo, useState } from "react"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { ArrowLeft, CheckCircle2, ScanLine, Search } from "lucide-react"

interface RsvpRow {
  id: string
  guestName: string
  guestCount: number
  attendanceStatus: string
  checkInCode: string | null
  checkedInAt: string | null
}

export default function CheckInClient({
  invitation,
  rsvps,
}: {
  invitation: { id: string; title: string; slug: string }
  rsvps: RsvpRow[]
}) {
  const [query, setQuery] = useState("")
  const [manualCode, setManualCode] = useState("")
  const [rows, setRows] = useState(rsvps)
  const [loadingId, setLoadingId] = useState("")
  const [error, setError] = useState("")

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) =>
        row.guestName.toLowerCase().includes(q) ||
        (row.checkInCode || "").toLowerCase().includes(q)
    )
  }, [query, rows])

  async function checkIn(payload: { rsvpId?: string; code?: string }, key: string) {
    setError("")
    setLoadingId(key)
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not check in guest")
        return
      }

      setRows((current) =>
        current.map((row) =>
          row.id === data.id ? { ...row, checkedInAt: data.checkedInAt || new Date().toISOString() } : row
        )
      )
      setManualCode("")
    } catch {
      setError("Could not check in guest")
    } finally {
      setLoadingId("")
    }
  }

  return (
    <div className={dt.containerWide}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={dt.heading}>Guest check-in</h1>
            <p className={`${dt.subheading} mt-1`}>{invitation.title}</p>
          </div>
          <ButtonLink href={`/dashboard/invitations/${invitation.id}/rsvps`} variant="outline" size="sm" tone="light">
            <ArrowLeft size={14} /> Back to RSVPs
          </ButtonLink>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className={`${dt.card} p-6`}>
            <Input
              label="Search guests"
              tone="light"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or code"
              id="search-guests"
            />

            <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {visibleRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{row.guestName}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {row.guestCount} guest{row.guestCount !== 1 ? "s" : ""} · Code{" "}
                      {(row.checkInCode || "pending").slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  {row.checkedInAt ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={14} /> Checked in
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      tone="light"
                      onClick={() => checkIn({ rsvpId: row.id }, row.id)}
                      disabled={loadingId === row.id}
                    >
                      <ScanLine size={13} /> {loadingId === row.id ? "Checking..." : "Check in"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`${dt.card} h-fit p-6`}>
            <p className={dt.label}>Manual code check-in</p>
            <div className="mt-4 space-y-4">
              <Input
                label="Confirmation code"
                tone="light"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Paste the guest code"
                id="manual-checkin"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                variant="primary"
                size="md"
                tone="light"
                className="w-full"
                onClick={() => checkIn({ code: manualCode }, "manual")}
                disabled={!manualCode || loadingId === "manual"}
              >
                <Search size={14} /> {loadingId === "manual" ? "Checking..." : "Check in by code"}
              </Button>
            </div>
          </div>
        </div>
    </div>
  )
}
