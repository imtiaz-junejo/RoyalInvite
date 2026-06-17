"use client"

import { useState, FormEvent } from "react"
import { cn } from "@/lib/utils"
import { dashboardTheme as dt } from "@/components/dashboard/dashboard-theme"
import { type } from "@/lib/typography"
import { updateProfile, changePassword } from "@/lib/actions"
import {
  User,
  Bell,
  KeyRound,
  CreditCard,
  Settings,
  Save,
  Loader2,
  Mail,
  Building2,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
} from "lucide-react"

type TabId = "profile" | "notifications" | "api" | "billing"

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: KeyRound },
  { id: "billing", label: "Billing", icon: CreditCard },
]

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "America/New York", value: "America/New_York" },
  { label: "America/Chicago", value: "America/Chicago" },
  { label: "America/Denver", value: "America/Denver" },
  { label: "America/Los Angeles", value: "America/Los_Angeles" },
  { label: "Europe/London", value: "Europe/London" },
  { label: "Europe/Paris", value: "Europe/Paris" },
  { label: "Europe/Berlin", value: "Europe/Berlin" },
  { label: "Asia/Dubai", value: "Asia/Dubai" },
  { label: "Asia/Karachi", value: "Asia/Karachi" },
  { label: "Asia/Mumbai", value: "Asia/Kolkata" },
  { label: "Asia/Singapore", value: "Asia/Singapore" },
  { label: "Asia/Tokyo", value: "Asia/Tokyo" },
  { label: "Australia/Sydney", value: "Australia/Sydney" },
]

interface SettingsClientProps {
  user: {
    id: string
    name: string
    email: string
    company: string | null
    timezone: string
    tier: string
    invitationCount: number
  }
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile")

  return (
    <div className={dt.containerNarrow}>
      <div className="flex items-center gap-3 border-b border-neutral-200/60 pb-6 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <Settings className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your account credentials, notifications, and workspace configurations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-neutral-200/80 bg-white p-2 shadow-sm space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 select-none",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-all",
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-9">
          {activeTab === "profile" && <ProfileSection user={user} />}
          {activeTab === "notifications" && <NotificationsSection />}
          {activeTab === "api" && <ComingSoonSection title="API Access Tokens" icon={KeyRound} />}
          {activeTab === "billing" && <BillingSection user={user} />}
        </div>
      </div>
    </div>
  )
}

function ProfileSection({ user }: { user: SettingsClientProps["user"] }) {
  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      <SecurityCard />
    </div>
  )
}

function ProfileCard({ user }: { user: SettingsClientProps["user"] }) {
  const [name, setName] = useState(user.name || user.email.split("@")[0] || "")
  const [company, setCompany] = useState(user.company || "")
  const [timezone, setTimezone] = useState(user.timezone || "UTC")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const initials = (name[0] || user.email[0] || "U").toUpperCase()

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const result = await updateProfile({ name, company, timezone })
    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully." })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile." })
    }
    setSaving(false)
  }

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-5 sm:p-6 lg:p-7 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-950">Profile Information</h3>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Manage your personal credentials and preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-sm select-none">
              {initials}
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-neutral-900">Avatar</p>
            <p className="text-[10px] text-neutral-500 leading-relaxed">
              Your initials are displayed as your profile avatar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 pl-9 text-xs text-neutral-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="email"
                value={user.email}
                readOnly
                className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-100/50 px-3 pl-9 text-xs text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Company Label
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 pl-9 text-xs text-neutral-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              System Timezone
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 text-neutral-900 pl-9 pr-3 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors cursor-pointer appearance-none"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span>Saving profile...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 shrink-0" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div
            className={cn(
              "rounded-xl border p-4 flex items-start gap-3 shadow-sm",
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50"
                : "border-red-200 bg-red-50"
            )}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="text-xs text-neutral-700">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SecurityCard() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters." })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." })
      return
    }

    setSaving(true)
    const result = await changePassword({ currentPassword, newPassword })
    if (result.success) {
      setMessage({ type: "success", text: "Password changed successfully." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setMessage({ type: "error", text: result.error || "Failed to change password." })
    }
    setSaving(false)
  }

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-5 sm:p-6 lg:p-7 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
          <Shield className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-950">Security Credentials</h3>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Regularly cycle your account passwords to prevent unauthorized access.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={cn(
            "rounded-xl border p-4 flex items-start gap-3 shadow-sm",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-neutral-700">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 text-xs text-neutral-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 text-xs text-neutral-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 text-xs text-neutral-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-4 border-t border-neutral-100 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span>Changing credentials...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    emailDigests: true,
    campaignAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  })

  function toggle(key: keyof typeof prefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    {
      key: "emailDigests" as const,
      label: "Email Digests",
      description: "Receive daily summaries of your invitation activity and RSVP updates.",
    },
    {
      key: "campaignAlerts" as const,
      label: "Campaign Alerts",
      description: "Get notified when invitations are published, viewed, or need attention.",
    },
    {
      key: "weeklyReports" as const,
      label: "Weekly Reports",
      description: "A comprehensive breakdown of your weekly invitation performance.",
    },
    {
      key: "marketingEmails" as const,
      label: "Marketing Emails",
      description: "Product updates, tips, and promotional content.",
    },
  ]

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-5 sm:p-6 lg:p-7 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
          <Bell className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-950">Notification Preferences</h3>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Toggle delivery channels for invitation actions.
          </p>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-neutral-700">{item.label}</p>
              <p className="text-[10px] text-neutral-500 leading-relaxed max-w-md">
                {item.description}
              </p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-colors duration-250 select-none shrink-0",
        checked
          ? "bg-indigo-600"
          : "bg-neutral-200 border border-neutral-300"
      )}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-250",
          checked ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
    </button>
  )
}

function ComingSoonSection({ title, icon: Icon }: { title: string; icon: typeof User }) {
  return (
    <div className="rounded-xl border border-neutral-200/80 bg-white p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
          <Icon className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-neutral-950">{title}</h3>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            This module is currently under development. Stay tuned for platform updates!
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full">
          <Info className="h-3.5 w-3.5" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  )
}

function BillingSection({ user }: { user: SettingsClientProps["user"] }) {
  const isPro = user.tier === "pro"
  const maxInvitations = isPro ? Infinity : 2
  const invitationPercent = isPro
    ? 10
    : Math.min((user.invitationCount / 2) * 100, 100)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200/80 bg-white p-5 sm:p-6 lg:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/35 to-transparent" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
              Current Subscription
            </p>
            <h3 className="text-2xl font-black font-mono tracking-tight text-neutral-950">
              {isPro ? "Pro Tier" : "Free Tier"}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {isPro
                ? "$49/month \u2022 Unlimited invitations and premium features."
                : `Active sandbox. Limited to ${maxInvitations} invitation${maxInvitations !== 1 ? "s" : ""}.`}
            </p>
          </div>
          <a
            href="/dashboard/billing"
            className={cn(
              "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold shadow-sm shrink-0 select-none active:scale-[0.98] transition-all",
              isPro
                ? "bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-95"
            )}
          >
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200/80 bg-white p-5 sm:p-6 lg:p-7 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
            <CreditCard className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-950">Usage</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Real-time limits check for current payment plan.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-neutral-600">
              <span>Invitations Created</span>
              <span className="font-mono text-neutral-950 font-bold">
                {user.invitationCount} / {isPro ? "Unlimited" : maxInvitations}
              </span>
            </div>
            <div className="flex gap-1.5 select-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2.5 flex-1 rounded-full border",
                    i < (invitationPercent / 10)
                      ? "bg-indigo-500 border-indigo-200 shadow-xs"
                      : "bg-neutral-100 border-neutral-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
