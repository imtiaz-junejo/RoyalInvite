"use client"

import { useState, useCallback, useEffect } from "react"
import { InvitationCard, type InvitationData } from "@/components/invitation-card"
import { Countdown } from "@/components/countdown"
import { MusicPlayer } from "@/components/music-player"
import { ParticleCanvas } from "@/components/particle-canvas"
import { Confetti, useConfetti } from "@/components/confetti"
import { ShareModal } from "@/components/share-modal"
import { themes } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Share2, Heart, BookHeart, Languages, Images, CalendarDays, ScanLine, Bell } from "lucide-react"
import { parseMealOptions } from "@/lib/utils"
import { formatEventDate } from "@/lib/ssr"

const languageLabels = {
  en: { venue: "Venue", rsvp: "RSVP", story: "Our Story", schedule: "Wedding Day", events: "Celebration Events", gallery: "Story Gallery", guestbook: "Guestbook", yourName: "Your Name", email: "Email (optional)", guests: "Guest Count", meal: "Meal Preference", whatsapp: "WhatsApp Number", reminders: "Send me WhatsApp reminders and wedding updates", message: "Message (optional)", wishes: "Leave Your Wishes", submitRsvp: "Send RSVP", submitWish: "Post Your Wish", thanks: "Thank You!", response: "Your response has been recorded.", blessingName: "Your Name", blessingMessage: "Your blessing or wish", language: "Language", checkIn: "Your Event Check-In Code" },
  hi: { venue: "स्थान", rsvp: "आरएसवीपी", story: "हमारी कहानी", schedule: "विवाह कार्यक्रम", events: "उत्सव कार्यक्रम", gallery: "स्मृति चित्र", guestbook: "शुभकामनाएँ", yourName: "आपका नाम", email: "ईमेल (वैकल्पिक)", guests: "अतिथि संख्या", meal: "भोजन पसंद", whatsapp: "व्हाट्सऐप नंबर", reminders: "मुझे व्हाट्सऐप रिमाइंडर और अपडेट भेजें", message: "संदेश (वैकल्पिक)", wishes: "अपनी शुभकामनाएँ लिखें", submitRsvp: "आरएसवीपी भेजें", submitWish: "शुभकामना भेजें", thanks: "धन्यवाद!", response: "आपकी प्रतिक्रिया दर्ज हो गई है।", blessingName: "आपका नाम", blessingMessage: "अपनी शुभकामना लिखें", language: "भाषा", checkIn: "आपका चेक-इन कोड" },
  ur: { venue: "مقام", rsvp: "جواب دیں", story: "ہماری کہانی", schedule: "تقریب کا شیڈول", events: "تقریبات", gallery: "یادوں کی جھلک", guestbook: "دعائیں", yourName: "آپ کا نام", email: "ای میل (اختیاری)", guests: "مہمانوں کی تعداد", meal: "کھانے کی پسند", whatsapp: "واٹس ایپ نمبر", reminders: "مجھے واٹس ایپ یاددہانی اور اپ ڈیٹس بھیجیں", message: "پیغام (اختیاری)", wishes: "اپنی دعا لکھیں", submitRsvp: "جواب بھیجیں", submitWish: "دعائیں بھیجیں", thanks: "شکریہ!", response: "آپ کا جواب محفوظ ہو گیا ہے۔", blessingName: "آپ کا نام", blessingMessage: "اپنی دعا یا پیغام", language: "زبان", checkIn: "آپ کا چیک ان کوڈ" },
  mr: { venue: "स्थळ", rsvp: "उत्तर", story: "आमची कहाणी", schedule: "कार्यक्रम", events: "समारंभ", gallery: "आठवणींची चित्रफीत", guestbook: "शुभेच्छा", yourName: "तुमचे नाव", email: "ईमेल (ऐच्छिक)", guests: "पाहुण्यांची संख्या", meal: "जेवणाची पसंती", whatsapp: "व्हॉट्सअॅप नंबर", reminders: "मला व्हॉट्सअॅप रिमाइंडर आणि अपडेट पाठवा", message: "संदेश (ऐच्छिक)", wishes: "तुमच्या शुभेच्छा लिहा", submitRsvp: "उत्तर पाठवा", submitWish: "शुभेच्छा पाठवा", thanks: "धन्यवाद!", response: "तुमचा प्रतिसाद नोंदवला गेला आहे.", blessingName: "तुमचे नाव", blessingMessage: "तुमची शुभेच्छा", language: "भाषा", checkIn: "तुमचा चेक-इन कोड" },
  gu: { venue: "સ્થળ", rsvp: "પ્રતિસાદ", story: "અમારી કહાની", schedule: "કાર્યક્રમ", events: "ઉજવણી પ્રસંગો", gallery: "સ્મૃતિ ગેલેરી", guestbook: "શુભેચ્છાઓ", yourName: "તમારું નામ", email: "ઇમેલ (વૈકલ્પિક)", guests: "મહેમાનોની સંખ્યા", meal: "ભોજન પસંદગી", whatsapp: "વોટ્સએપ નંબર", reminders: "મને વોટ્સએપ રિમાઇન્ડર અને અપડેટ મોકલો", message: "સંદેશ (વૈકલ્પિક)", wishes: "તમારી શુભેચ્છા લખો", submitRsvp: "પ્રતિસાદ મોકલો", submitWish: "શુભેચ્છા મોકલો", thanks: "આભાર!", response: "તમારો પ્રતિસાદ સાચવાયો છે.", blessingName: "તમારું નામ", blessingMessage: "તમારી શુભેચ્છા", language: "ભાષા", checkIn: "તમારો ચેક-ઇન કોડ" },
} as const

interface PublicInvitationProps {
  invitation: InvitationData
  slug: string
  galleryImages: { url: string; caption: string }[]
  scheduleItems: { time: string; event: string }[]
  eventSeriesItems: { label: string; date: string; time: string; venue: string }[]
  guestbookEntries: { id: string; guestName: string; message: string; createdAt: string }[]
}

export default function PublicInvitationPage({ invitation, slug, invitationId, galleryImages, scheduleItems, eventSeriesItems, guestbookEntries }: PublicInvitationProps & { invitationId: string }) {
  const theme = themes[invitation.themeKey || "gold"]
  const [shareOpen, setShareOpen] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState(invitation.primaryLanguage || "en")
  const [rsvpName, setRsvpName] = useState("")
  const [rsvpEmail, setRsvpEmail] = useState("")
  const [guestCount, setGuestCount] = useState("1")
  const [mealPreference, setMealPreference] = useState("")
  const [guestWhatsapp, setGuestWhatsapp] = useState("")
  const [whatsappConsent, setWhatsappConsent] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not_attending" | "maybe">("attending")
  const [rsvpMessage, setRsvpMessage] = useState("")
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const [checkInCode, setCheckInCode] = useState("")
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false)
  const [rsvpError, setRsvpError] = useState("")
  const [blessingName, setBlessingName] = useState("")
  const [blessingMessage, setBlessingMessage] = useState("")
  const [guestbookError, setGuestbookError] = useState("")
  const [guestbookSubmitting, setGuestbookSubmitting] = useState(false)
  const [entries, setEntries] = useState(guestbookEntries)
  const mealOptions = parseMealOptions(invitation.mealOptions)
  const labels = languageLabels[activeLanguage as keyof typeof languageLabels] || languageLabels.en

  const handleSubmitRsvp = useCallback(async () => {
    if (!rsvpName.trim()) {
      setRsvpError("Please enter your name")
      return
    }
    if (whatsappConsent && !guestWhatsapp.trim()) {
      setRsvpError("Please enter your WhatsApp number for reminders")
      return
    }
    setRsvpError("")
    setRsvpSubmitting(true)

    try {
      const res = await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: rsvpName,
          guestEmail: rsvpEmail || undefined,
          guestCount,
          mealPreference: mealPreference || undefined,
          guestWhatsapp: guestWhatsapp || undefined,
          whatsappConsent,
          attendanceStatus: rsvpStatus,
          message: rsvpMessage || undefined,
        }),
      })

      if (res.ok) {
        const rsvp = await res.json()
        setRsvpSubmitted(true)
        setCheckInCode(rsvp.checkInCode || "")
        setConfetti(true)
      } else {
        setRsvpError("Failed to submit RSVP. Please try again.")
      }
    } catch {
      setRsvpError("Something went wrong.")
    } finally {
      setRsvpSubmitting(false)
    }
  }, [guestCount, mealPreference, guestWhatsapp, whatsappConsent, rsvpName, rsvpEmail, rsvpStatus, rsvpMessage, invitationId])

  const handleSubmitWish = useCallback(async () => {
    if (!blessingName.trim() || !blessingMessage.trim()) {
      setGuestbookError("Please share your name and a short wish.")
      return
    }

    setGuestbookError("")
    setGuestbookSubmitting(true)
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: blessingName, message: blessingMessage }),
      })

      if (!res.ok) {
        setGuestbookError("Could not post your wish right now.")
        return
      }

      const entry = await res.json()
      setEntries((current) => [{ ...entry, createdAt: new Date().toISOString() }, ...current].slice(0, 20))
      setBlessingName("")
      setBlessingMessage("")
    } catch {
      setGuestbookError("Could not post your wish right now.")
    } finally {
      setGuestbookSubmitting(false)
    }
  }, [blessingMessage, blessingName, invitationId])

  // Set document background
  useEffect(() => {
    document.body.style.background = theme.bg
    document.body.style.color = theme.text
    return () => {
      document.body.style.background = ""
      document.body.style.color = ""
    }
  }, [theme])

  useEffect(() => {
    const viewedKey = `invite-viewed:${invitationId}`
    if (sessionStorage.getItem(viewedKey)) return

    fetch(`/api/invitations/${invitationId}/view?source=invite-page`, { method: "POST" }).catch(() => {})
    sessionStorage.setItem(viewedKey, "1")
  }, [invitationId])

  return (
    <div className="min-h-screen relative" style={{ background: theme.bg, color: theme.text }}>
      <ParticleCanvas accentColor={theme.accent} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <p className="font-cinzel text-[11px] tracking-[3px] uppercase opacity-50" style={{ color: theme.accent }}>
          Wedding Invitation
        </p>
        <button
          onClick={() => setShareOpen(true)}
          className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(201,168,76,0.3)", color: theme.accent }}
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Hero names */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 py-8"
      >
        <h1
          className="font-cormorant text-[clamp(36px,8vw,64px)] font-light italic leading-tight mb-2"
          style={{ fontFamily: "var(--font-cormorant)", color: theme.accent, textShadow: `0 0 30px ${theme.glow}` }}
        >
          <span className="block">{invitation.brideName}</span>
          <span className="font-cinzel text-lg tracking-[4px] opacity-40 block my-2 not-italic">
            &amp;
          </span>
          <span className="block">{invitation.groomName}</span>
        </h1>
        {invitation.headline && (
          <p className="font-cinzel text-[10px] tracking-[4px] uppercase opacity-50 mt-4" style={{ color: theme.accent2 }}>
            {activeLanguage !== invitation.primaryLanguage && invitation.secondaryHeadline
              ? invitation.secondaryHeadline
              : invitation.headline}
          </p>
        )}
      </motion.div>

      {invitation.secondaryLanguage && (
        <div className="relative z-10 flex justify-center mb-6 px-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs" style={{ borderColor: "rgba(201,168,76,0.2)", background: "rgba(255,255,255,0.04)" }}>
            <Languages size={14} style={{ color: theme.accent }} />
            <span className="font-cinzel tracking-[2px] uppercase opacity-70">{labels.language}</span>
            {[invitation.primaryLanguage || "en", invitation.secondaryLanguage].filter(Boolean).map((language) => (
              <button
                key={language}
                onClick={() => setActiveLanguage(language as typeof activeLanguage)}
                className="rounded-full px-3 py-1 transition-colors"
                style={{
                  background: activeLanguage === language ? `${theme.accent}25` : "transparent",
                  color: activeLanguage === language ? theme.accent : theme.text,
                }}
              >
                {(language || "").toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Countdown */}
      <div className="relative z-10 px-6 mb-6">
        <Countdown eventDate={invitation.eventDate} accent={theme.accent} borderColor="rgba(201,168,76,0.3)" />
      </div>

      {/* Music */}
      {invitation.musicUrl && (
        <div className="relative z-10 px-6 mb-8 flex justify-center">
          <MusicPlayer title={invitation.musicTitle} artist={invitation.musicArtist} url={invitation.musicUrl} accent={theme.accent} />
        </div>
      )}

      {/* 3D Card */}
      <div className="relative z-10 px-4 mb-10">
        <InvitationCard data={invitation} />
      </div>

      {galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto px-6 mb-10"
        >
          <div className="flex items-center gap-2 mb-4" style={{ color: theme.accent }}>
            <Images size={16} />
            <p className="font-cinzel text-[10px] tracking-[3px] uppercase">{labels.gallery}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={`${image.url}-${index}`} className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(255,255,255,0.05)" }}>
                <div className="h-56 bg-center bg-cover" style={{ backgroundImage: `url('${image.url}')` }} role="img" aria-label={image.caption || `Wedding memory ${index + 1}`} />
                {image.caption && <p className="px-4 py-3 text-sm opacity-70 leading-relaxed">{image.caption}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Venue Card */}
      {(invitation.venueName || invitation.venueAddress || invitation.googleMapsLink) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-md mx-auto px-6 mb-10"
        >
          <div className="text-center mb-4">
            <h2 className="font-cinzel text-[10px] tracking-[3px] uppercase mb-2" style={{ color: theme.accent }}>
              {labels.venue}
            </h2>
            <div className="flex items-center justify-center gap-3 w-32 mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
              <span className="text-[8px]" style={{ color: theme.accent }}>◆</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
            </div>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}
          >
            {/* Venue name */}
            {invitation.venueName && (
              <p className="font-cormorant text-xl italic mb-2" style={{ color: theme.accent }}>
                {invitation.venueName}
              </p>
            )}

            {/* Venue address */}
            {invitation.venueAddress && (
              <p className="text-sm opacity-60 leading-relaxed mb-3" style={{ color: "var(--text-color, #fdf8f0)" }}>
                {invitation.venueAddress.length > 100
                  ? invitation.venueAddress.slice(0, 100) + "…"
                  : invitation.venueAddress}
              </p>
            )}

            {/* Google Maps button */}
            {invitation.googleMapsLink && (
              <a
                href={invitation.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `${theme.accent}15`,
                  border: `1px solid ${theme.accent}40`,
                  color: theme.accent,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-cinzel text-[11px] tracking-wider uppercase">View Venue on Map</span>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {(invitation.storyTitle || invitation.storyText) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-6 mb-10"
        >
          <div className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
            <div className="flex items-center gap-2 mb-3" style={{ color: theme.accent }}>
              <BookHeart size={16} />
              <p className="font-cinzel text-[10px] tracking-[3px] uppercase">{labels.story}</p>
            </div>
            <h2 className="font-cormorant text-3xl italic mb-3" style={{ color: theme.accent }}>
              {activeLanguage !== invitation.primaryLanguage && invitation.secondaryStoryTitle
                ? invitation.secondaryStoryTitle
                : invitation.storyTitle}
            </h2>
            <p className="text-sm opacity-75 leading-relaxed">
              {activeLanguage !== invitation.primaryLanguage && invitation.secondaryStoryText
                ? invitation.secondaryStoryText
                : invitation.storyText}
            </p>
          </div>
        </motion.div>
      )}

      {scheduleItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-6 mb-10"
        >
          <div className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
            <p className="font-cinzel text-[10px] tracking-[3px] uppercase mb-4" style={{ color: theme.accent }}>
              {labels.schedule}
            </p>
            <div className="space-y-3">
              {scheduleItems.map((item) => (
                <div key={`${item.time}-${item.event}`} className="flex items-start justify-between gap-4 border-b pb-3" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                  <p className="font-cinzel text-xs tracking-[2px] uppercase" style={{ color: theme.accent }}>{item.time}</p>
                  <p className="text-sm opacity-75 text-right">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {eventSeriesItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-6 mb-10"
        >
          <div className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
            <div className="flex items-center gap-2 mb-4" style={{ color: theme.accent }}>
              <CalendarDays size={16} />
              <p className="font-cinzel text-[10px] tracking-[3px] uppercase">{invitation.eventSeriesTitle || labels.events}</p>
            </div>
            <div className="space-y-3">
              {eventSeriesItems.map((item) => (
                <div key={`${item.label}-${item.date}-${item.time}`} className="rounded-xl border p-4" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-cinzel text-[11px] tracking-[2px] uppercase" style={{ color: theme.accent }}>{item.label}</p>
                      <p className="text-sm opacity-75 mt-1">{item.venue}</p>
                    </div>
                    <div className="text-sm opacity-70 md:text-right">
                      <p>{item.date}</p>
                      <p>{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* RSVP Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-md mx-auto px-6 pb-12"
      >
        <div className="text-center mb-6">
          <h2 className="font-cinzel text-[10px] tracking-[3px] uppercase mb-2" style={{ color: theme.accent }}>
            {labels.rsvp}
          </h2>
          <div className="flex items-center justify-center gap-3 w-32 mx-auto mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
            <span className="text-[8px]" style={{ color: theme.accent }}>◆</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
          </div>
        </div>

        {rsvpSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 rounded-xl border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}
          >
            <Heart size={32} className="mx-auto mb-3" style={{ color: theme.accent }} />
            <p className="font-cormorant text-xl italic mb-2" style={{ color: theme.accent }}>
              {labels.thanks}
            </p>
            <p className="text-sm opacity-60">
              {labels.response}
            </p>
            {checkInCode && (
              <div className="mt-4 rounded-xl border p-4 inline-flex flex-col items-center gap-2" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
                <div className="flex items-center gap-2" style={{ color: theme.accent }}>
                  <ScanLine size={16} />
                  <p className="font-cinzel text-[10px] tracking-[2px] uppercase">{labels.checkIn}</p>
                </div>
                <p className="font-cinzel text-sm tracking-[3px]" style={{ color: theme.accent }}>{checkInCode.slice(0, 8).toUpperCase()}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="rounded-xl border p-6 space-y-4" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
              <Input
                label={labels.yourName}
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Full name"
                id="rsvp-name"
              />
              <Input
                label={labels.email}
                type="email"
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
                placeholder="you@example.com"
                id="rsvp-email"
              />
              <Input
                label={labels.guests}
                type="number"
                min="1"
                max="10"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                id="rsvp-count"
              />
              {mealOptions.length > 0 ? (
                <Select label={labels.meal} value={mealPreference} onChange={(e) => setMealPreference(e.target.value)} id="rsvp-meal">
                  <option value="">Select an option</option>
                  {mealOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  label={labels.meal}
                  value={mealPreference}
                  onChange={(e) => setMealPreference(e.target.value)}
                  placeholder="Optional"
                  id="rsvp-meal"
                />
              )}

              <Input
                label={labels.whatsapp}
                type="tel"
                value={guestWhatsapp}
                onChange={(e) => setGuestWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                id="rsvp-whatsapp"
              />

              <label className="flex items-start gap-3 rounded-xl border p-3 text-sm leading-relaxed cursor-pointer" style={{ borderColor: "rgba(201,168,76,0.16)", background: "rgba(255,255,255,0.03)" }}>
                <input
                  type="checkbox"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#c9a84c]"
                />
                <span className="flex-1 opacity-75">
                  <span className="inline-flex items-center gap-2" style={{ color: theme.accent }}>
                    <Bell size={14} /> {labels.reminders}
                  </span>
                  <span className="block text-xs opacity-55 mt-1">Messages come from the official invitation number.</span>
                </span>
              </label>

              <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-wider uppercase text-accent2/80 font-cinzel">
                Will you attend?
              </label>
              <div className="flex gap-2">
                {(["attending", "not_attending", "maybe"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setRsvpStatus(status)}
                    className="flex-1 py-2.5 rounded-lg border text-xs transition-all font-lato"
                    style={{
                      background: rsvpStatus === status ? theme.accent + "20" : "transparent",
                      borderColor: rsvpStatus === status ? theme.accent : "rgba(201,168,76,0.2)",
                      color: rsvpStatus === status ? theme.accent : "inherit",
                    }}
                  >
                    {status === "attending" ? "💍 Attending" : status === "not_attending" ? "😔 Can't Make It" : "🤔 Maybe"}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label={labels.message}
              value={rsvpMessage}
              onChange={(e) => setRsvpMessage(e.target.value)}
              placeholder="Wishes for the couple..."
              className="min-h-[60px]"
              id="rsvp-message"
            />

            {rsvpError && (
              <p className="text-red-400 text-xs text-center">{rsvpError}</p>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSubmitRsvp}
              disabled={rsvpSubmitting}
            >
              {rsvpSubmitting ? "Submitting..." : labels.submitRsvp}
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-2xl mx-auto px-6 pb-12"
      >
        <div className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)" }}>
          <p className="font-cinzel text-[10px] tracking-[3px] uppercase mb-4" style={{ color: theme.accent }}>
            {labels.guestbook}
          </p>
          <div className="space-y-3 mb-6">
            {entries.length === 0 ? (
              <p className="text-sm opacity-55">Be the first to leave a blessing for the couple.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-xl border p-4" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-cinzel text-[11px] tracking-[2px] uppercase" style={{ color: theme.accent }}>{entry.guestName}</p>
                    <span className="text-[10px] opacity-40">{formatEventDate(entry.createdAt)}</span>
                  </div>
                  <p className="text-sm opacity-75 leading-relaxed">{entry.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <Input label={labels.blessingName} value={blessingName} onChange={(e) => setBlessingName(e.target.value)} placeholder="Your name" id="guestbook-name" />
            <Textarea label={labels.blessingMessage} value={blessingMessage} onChange={(e) => setBlessingMessage(e.target.value)} placeholder="Share your love, blessing, or a warm memory." className="min-h-[90px]" id="guestbook-message" />
            {guestbookError && <p className="text-red-400 text-xs text-center">{guestbookError}</p>}
            <Button variant="outline" size="md" className="w-full" onClick={handleSubmitWish} disabled={guestbookSubmitting}>
              {guestbookSubmitting ? "Posting..." : labels.submitWish}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-12 px-6">
        <div className="flex items-center justify-center gap-3 w-32 mx-auto mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
          <span className="text-[8px]" style={{ color: theme.accent }}>◆</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: theme.accent }} />
        </div>
        <p className="font-cormorant italic text-sm opacity-40">
          Made with ♡ — Eternally Yours
        </p>
      </div>

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        slug={slug}
        title={`${invitation.brideName} & ${invitation.groomName}`}
      />

      {/* Confetti */}
      <Confetti active={confetti} onComplete={() => setConfetti(false)} />
      <div id="confetti-container" />
    </div>
  )
}
