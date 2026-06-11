import { templates, type TemplateKey } from "@/lib/themes"
import type { InvitationForm } from "@/lib/validations"

export function getTemplateDefaults(key: TemplateKey | null | undefined): Partial<InvitationForm> | null {
  if (!key || !templates[key]) return null
  const t = templates[key]
  return {
    templateKey: key,
    themeKey: t.theme,
    fontKey: t.font,
    brideName: t.bride,
    groomName: t.groom,
    headline: t.headline,
    message: t.message,
    familyNames: t.familyNames,
    venueName: t.venueName,
    venueAddress: t.venueAddress,
    dressCode: t.dressCode,
    musicTitle: t.musicTitle,
    musicArtist: t.musicArtist,
    storyTitle: t.storyTitle || "",
    storyText: t.storyText || "",
    mealOptions: t.mealOptions || "",
    scheduleText: t.scheduleText || "",
    eventSeriesTitle: t.eventSeriesTitle || "",
    eventSeriesText: t.eventSeriesText || "",
    primaryLanguage: t.primaryLanguage || "en",
    secondaryLanguage: t.secondaryLanguage || "",
  }
}

export function parseTemplateKey(value: string | null): TemplateKey | null {
  if (!value) return null
  return value in templates ? (value as TemplateKey) : null
}

/** Map form defaults to invitation preview card state */
export function templateDefaultsToPreview(
  defaults: Partial<InvitationForm> | null
): Record<string, string | undefined> {
  if (!defaults) return {}
  return {
    brideName: defaults.brideName,
    groomName: defaults.groomName,
    headline: defaults.headline,
    message: defaults.message,
    familyNames: defaults.familyNames,
    venueName: defaults.venueName,
    venueAddress: defaults.venueAddress,
    dressCode: defaults.dressCode,
    musicTitle: defaults.musicTitle,
    musicArtist: defaults.musicArtist,
    storyTitle: defaults.storyTitle,
    storyText: defaults.storyText,
    mealOptions: defaults.mealOptions,
    scheduleText: defaults.scheduleText,
    eventSeriesTitle: defaults.eventSeriesTitle,
    eventSeriesText: defaults.eventSeriesText,
    primaryLanguage: defaults.primaryLanguage,
    secondaryLanguage: defaults.secondaryLanguage,
    fontKey: defaults.fontKey,
    themeKey: defaults.themeKey,
  }
}
