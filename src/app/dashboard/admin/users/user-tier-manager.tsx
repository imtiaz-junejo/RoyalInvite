"use client"

import { useState } from "react"
import { Crown, User, Shield } from "lucide-react"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { formatEventDate } from "@/lib/ssr"

interface UserData {
  id: string
  name: string
  email: string
  tier: "free" | "pro"
  role: string
  invitationCount: number
  createdAt: string
}

export default function UserTierManager({ users }: { users: UserData[] }) {
  const [userList, setUserList] = useState(users)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "free" | "pro">("all")

  const filtered = userList.filter((u) => filter === "all" || u.tier === filter)

  const changeTier = async (userId: string, newTier: "free" | "pro") => {
    setLoadingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/tier`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      })
      if (res.ok) {
        setUserList((prev) => prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u)))
      }
    } catch (err) {
      console.error("Failed to change tier:", err)
    } finally {
      setLoadingId(null)
    }
  }

  const filterBtn = (active: boolean) =>
    active
      ? "rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
      : "rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"

  return (
    <div>
      <div className={`flex gap-2 border-b px-5 py-3 ${dt.divider}`}>
        {(["all", "free", "pro"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filterBtn(filter === f)}>
            {f === "all" ? "All" : f === "free" ? "Free" : "Pro"}
          </button>
        ))}
      </div>

      <div className={`divide-y ${dt.divider}`}>
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <User size={32} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-sm font-semibold text-neutral-700">No users found</p>
          </div>
        ) : (
          filtered.map((user) => (
            <div key={user.id} className="px-5 py-4 transition-colors hover:bg-neutral-50/80">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {user.role === "admin" && <Shield size={14} className="text-brand-600" />}
                    <span className="truncate text-base font-semibold text-neutral-900">{user.name}</span>
                  </div>
                  <p className={`${dt.subheading} text-xs`}>{user.email}</p>
                  <p className="mt-0.5 text-[10px] text-neutral-400">
                    {user.invitationCount} invitation{user.invitationCount !== 1 ? "s" : ""} · Joined{" "}
                    {formatEventDate(user.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      user.tier === "pro" ? dt.badgePro : dt.badgeFree
                    }`}
                  >
                    {user.tier === "pro" ? <Crown size={12} /> : <User size={12} />}
                    {user.tier}
                  </div>

                  <div className="flex overflow-hidden rounded-lg border border-neutral-200">
                    <button
                      onClick={() => changeTier(user.id, "free")}
                      disabled={loadingId === user.id || user.tier === "free"}
                      className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                        user.tier === "free"
                          ? "bg-brand-50 text-brand-700"
                          : "text-neutral-500 hover:bg-neutral-50"
                      } ${loadingId === user.id ? "opacity-50" : ""}`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => changeTier(user.id, "pro")}
                      disabled={loadingId === user.id || user.tier === "pro"}
                      className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                        user.tier === "pro"
                          ? "bg-brand-50 text-brand-700"
                          : "text-neutral-500 hover:bg-neutral-50"
                      } ${loadingId === user.id ? "opacity-50" : ""}`}
                    >
                      Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
