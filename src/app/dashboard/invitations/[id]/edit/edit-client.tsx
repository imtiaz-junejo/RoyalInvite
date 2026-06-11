"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { EditorForm } from "@/components/editor-form"
import { InvitationCard, type InvitationData } from "@/components/invitation-card"
import { Countdown } from "@/components/countdown"
import { MusicPlayer } from "@/components/music-player"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ShareModal } from "@/components/share-modal"
import { Confetti } from "@/components/confetti"
import { themes } from "@/lib/themes"
import { showToast, ToastProvider } from "@/components/ui/toast"
import { Mail, ExternalLink } from "lucide-react"
import {
  InvitationBuilderChrome,
  BuilderToolbarButton,
} from "@/components/dashboard/invitation-builder-chrome"

interface Invitation {
  id: string
  title: string
  brideName: string
  groomName: string
  headline: string
  secondaryHeadline: string
  eventDate: string
  eventTime: string
  venueName: string
  venueAddress: string
  googleMapsLink: string
  message: string
  secondaryMessage: string
  storyTitle: string
  storyText: string
  secondaryStoryTitle: string
  secondaryStoryText: string
  galleryText: string
  eventSeriesTitle: string
  eventSeriesText: string
  mealOptions: string
  scheduleText: string
  primaryLanguage: "en" | "hi" | "ur" | "mr" | "gu"
  secondaryLanguage: "en" | "hi" | "ur" | "mr" | "gu" | ""
  rsvpContact: string
  rsvpDeadline: string
  dressCode: string
  familyNames: string
  coverImage: string
  musicTitle: string
  musicArtist: string
  musicUrl: string
  fontKey: string
  themeKey: string
  templateKey: string
  isPublished: boolean
  slug: string
}

export default function EditInvitationClient({ invitation }: { invitation: Invitation }) {
  const router = useRouter()
  const [preview, setPreview] = useState<InvitationData>({
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    title: invitation.title,
    headline: invitation.headline,
    secondaryHeadline: invitation.secondaryHeadline,
    eventDate: invitation.eventDate,
    eventTime: invitation.eventTime,
    venueName: invitation.venueName,
    venueAddress: invitation.venueAddress,
    googleMapsLink: invitation.googleMapsLink,
    message: invitation.message,
    secondaryMessage: invitation.secondaryMessage,
    storyTitle: invitation.storyTitle,
    storyText: invitation.storyText,
    secondaryStoryTitle: invitation.secondaryStoryTitle,
    secondaryStoryText: invitation.secondaryStoryText,
    galleryText: invitation.galleryText,
    eventSeriesTitle: invitation.eventSeriesTitle,
    eventSeriesText: invitation.eventSeriesText,
    mealOptions: invitation.mealOptions,
    scheduleText: invitation.scheduleText,
    primaryLanguage: invitation.primaryLanguage,
    secondaryLanguage: invitation.secondaryLanguage,
    rsvpContact: invitation.rsvpContact,
    rsvpDeadline: invitation.rsvpDeadline,
    dressCode: invitation.dressCode,
    familyNames: invitation.familyNames,
    coverImage: invitation.coverImage,
    musicTitle: invitation.musicTitle,
    musicArtist: invitation.musicArtist,
    musicUrl: invitation.musicUrl,
    fontKey: invitation.fontKey as any,
    themeKey: invitation.themeKey as any,
  })
  const [saving, setSaving] = useState(false)
  const [isPublished, setIsPublished] = useState(invitation.isPublished)
  const [shareOpen, setShareOpen] = useState(false)
  const [confetti, setConfetti] = useState(false)

  const theme = themes[preview.themeKey || "gold"]

  const handlePreviewChange = useCallback((data: any) => {
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
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preview, isPublished }),
      })
      if (res.ok) {
        showToast("💾 Changes saved!")
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
  }, [preview, isPublished, invitation.id])

  const handlePublish = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preview, isPublished: true }),
      })
      if (res.ok) {
        setIsPublished(true)
        setConfetti(true)
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
  }, [preview, invitation.id])

  return (
    <ToastProvider>
      <div className="relative min-h-[calc(100vh-var(--site-nav-height))] bg-neutral-50">
        <ParticleCanvas accentColor={theme.accent} />

        <InvitationBuilderChrome
          mode="edit"
          aside={
            <EditorForm
              defaultValues={preview}
              onChange={handlePreviewChange}
              onSave={handleSave}
              onPublish={handlePublish}
              isPublished={isPublished}
              saving={saving}
              appearance="light"
            />
          }
          toolbar={
            isPublished ? (
              <>
                <BuilderToolbarButton href={`/dashboard/invitations/${invitation.id}/rsvps`}>
                  <Mail size={14} /> View RSVPs
                </BuilderToolbarButton>
                <BuilderToolbarButton onClick={() => setShareOpen(true)} variant="primary">
                  🔗 Share
                </BuilderToolbarButton>
                <BuilderToolbarButton href={`/invite/${invitation.slug}`}>
                  <ExternalLink size={14} /> View public page
                </BuilderToolbarButton>
              </>
            ) : null
          }
          preview={
            <div
              className="flex w-full max-w-2xl flex-col items-center"
              style={{ background: theme.bg2 }}
            >
              <div className="w-full rounded-2xl border border-neutral-200/20 p-6 shadow-inner">
                <Countdown eventDate={preview.eventDate} accent={theme.accent} />
                <div className="my-3">
                  <MusicPlayer
                    title={preview.musicTitle}
                    artist={preview.musicArtist}
                    url={preview.musicUrl}
                    accent={theme.accent}
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
          slug={invitation.slug}
          title={`${preview.brideName} & ${preview.groomName}`}
        />

        <Confetti active={confetti} onComplete={() => setConfetti(false)} />
        <div id="confetti-container" />
      </div>
    </ToastProvider>
  )
}
