"use client"

import { Suspense, useState, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EditorForm } from "@/components/editor-form"
import { InvitationCard, type InvitationData } from "@/components/invitation-card"
import { Countdown } from "@/components/countdown"
import { MusicPlayer } from "@/components/music-player"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ShareModal } from "@/components/share-modal"
import { Confetti } from "@/components/confetti"
import { themes } from "@/lib/themes"
import {
  getTemplateDefaults,
  parseTemplateKey,
  templateDefaultsToPreview,
} from "@/lib/template-defaults"
import type { InvitationForm } from "@/lib/validations"
import { showToast, ToastProvider } from "@/components/ui/toast"
import { BUILDER_DEFAULT_EVENT_DATE } from "@/lib/ssr"
import {
  InvitationBuilderChrome,
  BuilderToolbarButton,
} from "@/components/dashboard/invitation-builder-chrome"

const basePreview: InvitationData = {
    brideName: "Sophia",
    groomName: "Alexander",
    title: "Wedding Invitation",
    headline: "Together Forever",
    secondaryHeadline: "",
    eventDate: BUILDER_DEFAULT_EVENT_DATE,
    eventTime: "4:00 PM",
    venueName: "The Grand Ballroom",
    venueAddress: "123 Rose Garden Lane, New York, NY",
    message:
      "Together with their families, they joyfully invite you to celebrate their union in a day filled with love, laughter, and the promise of forever.",
    secondaryMessage: "",
    storyTitle: "How our forever began",
    storyText: "From our first hello to this beautiful day, every chapter has brought us closer to forever.",
    secondaryStoryTitle: "",
    secondaryStoryText: "",
    galleryText: "",
    eventSeriesTitle: "",
    eventSeriesText: "",
    mealOptions: "Vegetarian, Non-Vegetarian, Vegan",
    scheduleText: "4:00 PM | Guests Arrive\n4:30 PM | Ceremony\n6:00 PM | Dinner & Dancing",
    primaryLanguage: "en",
    secondaryLanguage: "",
    rsvpContact: "+1 (555) 000-0000",
    rsvpDeadline: "Kindly respond by October 1st",
    dressCode: "Black Tie Formal",
    familyNames: "The Anderson & Miller Families",
    fontKey: "cormorant",
    themeKey: "gold",
}

function NewInvitationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateKey = parseTemplateKey(searchParams.get("template"))
  const templateDefaults = useMemo(() => getTemplateDefaults(templateKey), [templateKey])

  const [preview, setPreview] = useState<InvitationData>(() => ({
    ...basePreview,
    ...templateDefaultsToPreview(templateDefaults),
  }))
  const [saving, setSaving] = useState(false)
  const [published, setPublished] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [savedSlug, setSavedSlug] = useState("")
  const [savedId, setSavedId] = useState("")

  const theme = themes[preview.themeKey || "gold"]

  const handlePreviewChange = useCallback((data: InvitationForm) => {
    setPreview({
      brideName: data.brideName || "Bride",
      groomName: data.groomName || "Groom",
      title: data.title || "Wedding Invitation",
      headline: data.headline,
      secondaryHeadline: data.secondaryHeadline,
      eventDate: data.eventDate || "",
      eventTime: data.eventTime || "",
      venueName: data.venueName || "The Venue",
      venueAddress: data.venueAddress || "",
      googleMapsLink: data.googleMapsLink || "",
      message: data.message,
      secondaryMessage: data.secondaryMessage,
      storyTitle: data.storyTitle,
      storyText: data.storyText,
      secondaryStoryTitle: data.secondaryStoryTitle,
      secondaryStoryText: data.secondaryStoryText,
      galleryText: data.galleryText,
      eventSeriesTitle: data.eventSeriesTitle,
      eventSeriesText: data.eventSeriesText,
      mealOptions: data.mealOptions,
      scheduleText: data.scheduleText,
      primaryLanguage: data.primaryLanguage || "en",
      secondaryLanguage: data.secondaryLanguage || "",
      rsvpContact: data.rsvpContact,
      rsvpDeadline: data.rsvpDeadline,
      dressCode: data.dressCode,
      familyNames: data.familyNames,
      coverImage: data.coverImage,
      musicTitle: data.musicTitle,
      musicArtist: data.musicArtist,
      musicUrl: data.musicUrl,
      fontKey: data.fontKey || "cormorant",
      themeKey: data.themeKey || "gold",
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(savedId ? `/api/invitations/${savedId}` : "/api/invitations", {
        method: savedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preview, isPublished: false }),
      })
      if (res.ok) {
        const payload = await res.json()
        const invitation = payload.invitation || payload
        setSavedId(invitation.id)
        setSavedSlug(invitation.slug)
        if (payload.editable === false) {
          showToast("Free tier invitations are locked after creation.")
          router.push("/dashboard")
          router.refresh()
          return
        }
        showToast("💾 Draft saved!")
      } else {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err.error) ? err.error[0]?.message : err.error || "Failed to save"
        showToast(msg, "error")
      }
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving(false)
    }
  }, [preview, router, savedId])

  const handlePublish = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(savedId ? `/api/invitations/${savedId}` : "/api/invitations", {
        method: savedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preview, isPublished: true }),
      })
      if (res.ok) {
        const payload = await res.json()
        const invitation = payload.invitation || payload
        setSavedId(invitation.id)
        setSavedSlug(invitation.slug)
        setPublished(true)
        setConfetti(true)
        if (payload.editable === false) {
          showToast("✦ Invitation published! Free tier invitations are locked after creation.")
          router.push("/dashboard")
          router.refresh()
          return
        }
        showToast("✦ Invitation published!")
      } else {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err.error) ? err.error[0]?.message : err.error || "Failed to publish"
        showToast(msg, "error")
      }
    } catch {
      showToast("Failed to publish", "error")
    } finally {
      setSaving(false)
    }
  }, [preview, router, savedId])

  return (
    <ToastProvider>
      <div className="relative min-h-[calc(100vh-var(--site-nav-height))] bg-neutral-50">
        <ParticleCanvas accentColor={theme.accent} />

        <InvitationBuilderChrome
          mode="new"
          aside={
            <EditorForm
              defaultValues={{ ...preview, ...templateDefaults }}
              onChange={handlePreviewChange}
              onSave={handleSave}
              onPublish={handlePublish}
              isPublished={published}
              saving={saving}
              appearance="light"
            />
          }
          toolbar={
            published && savedSlug ? (
              <BuilderToolbarButton onClick={() => setShareOpen(true)} variant="primary">
                🔗 Share invitation
              </BuilderToolbarButton>
            ) : null
          }
          preview={
            <div
              className="flex w-full max-w-2xl flex-col items-center"
              style={{ background: theme.bg2 }}
            >
              <div className="w-full rounded-2xl border border-neutral-200/20 p-6 shadow-inner">
                <Countdown eventDate={preview.eventDate} accent={theme.accent} borderColor="rgba(201,168,76,0.3)" />
                <div className="my-3">
                  <MusicPlayer
                    title={preview.musicTitle}
                    artist={preview.musicArtist}
                    url={preview.musicUrl}
                    accent={theme.accent}
                    borderColor="rgba(201,168,76,0.3)"
                  />
                </div>
                <div className="mt-4">
                  <InvitationCard data={preview} />
                </div>
                {(preview.storyTitle || preview.storyText || preview.scheduleText) && (
                  <div className="mt-8 w-full space-y-4">
                    {preview.storyTitle && (
                      <div
                        className="rounded-xl border p-5"
                        style={{ borderColor: "rgba(201,168,76,0.18)", background: "rgba(0,0,0,0.18)" }}
                      >
                        <p
                          className="mb-2 font-cinzel text-[10px] uppercase tracking-[3px]"
                          style={{ color: theme.accent }}
                        >
                          Love Story
                        </p>
                        <h3 className="mb-2 font-cormorant text-2xl italic" style={{ color: theme.accent }}>
                          {preview.storyTitle}
                        </h3>
                        {preview.storyText && (
                          <p className="text-sm leading-relaxed opacity-70">{preview.storyText}</p>
                        )}
                      </div>
                    )}
                    {preview.scheduleText && (
                      <div
                        className="rounded-xl border p-5"
                        style={{ borderColor: "rgba(201,168,76,0.18)", background: "rgba(0,0,0,0.18)" }}
                      >
                        <p
                          className="mb-3 font-cinzel text-[10px] uppercase tracking-[3px]"
                          style={{ color: theme.accent }}
                        >
                          Schedule Preview
                        </p>
                        <div className="space-y-2 text-sm opacity-80">
                          {preview.scheduleText.split("\n").filter(Boolean).map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          }
        />

        <ShareModal
          open={shareOpen}
          onOpenChange={setShareOpen}
          slug={
            savedSlug ||
            `${preview.brideName.toLowerCase()}-${preview.groomName.toLowerCase()}`.replace(/\s+/g, "-")
          }
          title={`${preview.brideName} & ${preview.groomName}`}
        />

        <Confetti active={confetti} onComplete={() => setConfetti(false)} />
        <div id="confetti-container" />
      </div>
    </ToastProvider>
  )
}

export default function NewInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-var(--site-nav-height))] items-center justify-center bg-neutral-50 font-sans text-sm text-neutral-500">
          Loading builder…
        </div>
      }
    >
      <NewInvitationContent />
    </Suspense>
  )
}
