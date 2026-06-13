"use client"

import { InvitationCard, type InvitationData } from "@/components/invitation-card"
import { Countdown } from "@/components/countdown"
import { MusicPlayer } from "@/components/music-player"
import type { ThemeConfig } from "@/lib/themes"

type InvitationBuilderPreviewContentProps = {
  preview: InvitationData
  theme: ThemeConfig
}

export function InvitationBuilderPreviewContent({
  preview,
  theme,
}: InvitationBuilderPreviewContentProps) {
  return (
    <div className="w-full rounded-2xl border border-neutral-200/20 p-4 shadow-inner sm:p-5" style={{ background: theme.bg2 }}>
      <Countdown
        eventDate={preview.eventDate}
        accent={theme.accent}
        borderColor="rgba(201,168,76,0.3)"
      />
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
  )
}
