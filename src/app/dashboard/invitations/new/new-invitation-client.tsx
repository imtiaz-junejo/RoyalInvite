"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { EditorForm } from "@/components/editor-form"
import type { InvitationData } from "@/components/invitation-card"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ShareModal } from "@/components/share-modal"
import { Confetti } from "@/components/confetti"
import { themes, type TemplateKey } from "@/lib/themes"
import { getTemplateDefaults, templateDefaultsToPreview } from "@/lib/template-defaults"
import type { InvitationForm } from "@/lib/validations"
import { showToast, ToastProvider } from "@/components/ui/toast"
import { BUILDER_DEFAULT_EVENT_DATE } from "@/lib/ssr"
import {
  InvitationBuilderChrome,
  BuilderToolbarButton,
} from "@/components/dashboard/invitation-builder-chrome"
import { InvitationBuilderPreviewContent } from "@/components/dashboard/invitation-builder-preview-content"

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

type NewInvitationClientProps = {
  templateKey: TemplateKey | null
}

export function NewInvitationClient({ templateKey }: NewInvitationClientProps) {
  const router = useRouter()
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
      <div className="relative h-[calc(100vh-var(--site-nav-height))] overflow-hidden bg-neutral-50">
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
          preview={<InvitationBuilderPreviewContent preview={preview} theme={theme} />}
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
