import { z } from "zod"

const languageSchema = z.enum(["en", "hi", "ur", "mr", "gu"])

export const invitationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  brideName: z.string().min(1, "Bride's name is required").max(100),
  groomName: z.string().min(1, "Groom's name is required").max(100),
  headline: z.string().max(200).optional(),
  secondaryHeadline: z.string().max(200).optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  venueName: z.string().min(1, "Venue name is required").max(200),
  venueAddress: z.string().max(500).optional(),
  googleMapsLink: z.string().max(500).refine(
    (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
    { message: "Enter a valid URL starting with http:// or https://" }
  ).optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  secondaryMessage: z.string().max(2000).optional(),
  storyTitle: z.string().max(200).optional(),
  storyText: z.string().max(3000).optional(),
  secondaryStoryTitle: z.string().max(200).optional(),
  secondaryStoryText: z.string().max(3000).optional(),
  galleryText: z.string().max(4000).optional(),
  eventSeriesTitle: z.string().max(200).optional(),
  eventSeriesText: z.string().max(3000).optional(),
  mealOptions: z.string().max(500).optional(),
  scheduleText: z.string().max(2000).optional(),
  primaryLanguage: languageSchema.default("en"),
  secondaryLanguage: languageSchema.optional().or(z.literal("")),
  rsvpContact: z.string().max(200).optional(),
  rsvpDeadline: z.string().max(200).optional(),
  dressCode: z.string().max(100).optional(),
  familyNames: z.string().max(200).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  musicTitle: z.string().max(200).optional(),
  musicArtist: z.string().max(200).optional(),
  musicUrl: z.string().url().optional().or(z.literal("")),
  fontKey: z.enum(["cormorant", "cinzel", "lato"]).default("cormorant"),
  themeKey: z.enum(["gold", "rose", "emerald", "ivory"]).default("gold"),
  templateKey: z.enum(["royal", "floral", "modern", "mehndi", "nikah", "heritage"]).default("royal"),
  customStyles: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export const rsvpSchema = z.object({
  guestName: z.string().min(1, "Your name is required").max(200),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestCount: z.coerce.number().int().min(1).max(10).default(1),
  mealPreference: z.string().max(100).optional().or(z.literal("")),
  guestWhatsapp: z.string().max(30).optional().or(z.literal("")),
  whatsappConsent: z.boolean().default(false),
  attendanceStatus: z.enum(["attending", "not_attending", "maybe"]),
  message: z.string().max(1000).optional(),
}).superRefine((data, ctx) => {
  const whatsapp = data.guestWhatsapp?.trim() || ""
  if (data.whatsappConsent && !whatsapp) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["guestWhatsapp"],
      message: "WhatsApp number is required for reminders",
    })
  }

  if (whatsapp && whatsapp.replace(/[^\d]/g, "").length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["guestWhatsapp"],
      message: "Enter a valid WhatsApp number",
    })
  }
})

export const guestbookSchema = z.object({
  guestName: z.string().min(1, "Your name is required").max(200),
  message: z.string().min(1, "A short wish is required").max(1000),
})

export const checkInSchema = z.object({
  rsvpId: z.string().optional(),
  code: z.string().optional(),
})

export type InvitationForm = z.infer<typeof invitationSchema>
export type RsvpForm = z.infer<typeof rsvpSchema>
export type GuestbookForm = z.infer<typeof guestbookSchema>
export type CheckInForm = z.infer<typeof checkInSchema>
