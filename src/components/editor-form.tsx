"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invitationSchema, type InvitationForm } from "@/lib/validations"
import {
  templates,
  themes,
  fonts,
  type ThemeKey,
  type FontKey,
  type TemplateKey,
  type TemplateConfig,
} from "@/lib/themes"
import { Input, Textarea, Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Save, Eye, Globe } from "lucide-react"

interface Section {
  id: string
  title: string
  icon: string
  open: boolean
}

interface EditorFormProps {
  defaultValues?: Partial<InvitationForm>
  onChange: (data: InvitationForm) => void
  onSave: () => void
  onPublish?: () => void
  isPublished?: boolean
  saving?: boolean
  /** Light sidebar for dashboard builder */
  appearance?: "light" | "dark"
}

export function EditorForm({
  defaultValues,
  onChange,
  onSave,
  onPublish,
  isPublished,
  saving,
  appearance = "light",
}: EditorFormProps) {
  const isLight = appearance === "light"
  const inputTone = isLight ? "light" : "dark"
  const sectionBorder = isLight ? "border-neutral-200" : ""
  const sectionBorderStyle = isLight ? undefined : { borderColor: "rgba(201,168,76,0.3)" }
  const sectionLabelClass = isLight
    ? "text-xs font-semibold uppercase tracking-wide text-neutral-500"
    : "font-sans text-[11px] font-semibold tracking-[2px] uppercase flex items-center gap-2"
  const sectionLabelStyle = isLight ? undefined : { color: "rgba(232,213,163,0.8)" }
  const quickLabelClass = isLight
    ? "mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
    : "text-[10px] font-semibold tracking-[1.5px] uppercase mb-3 font-sans"
  const quickLabelStyle = isLight ? undefined : { color: "rgba(232,213,163,0.8)" }
  const { register, watch, setValue, getValues, formState: { errors } } = useForm<InvitationForm>({
    resolver: zodResolver(invitationSchema),
    defaultValues: defaultValues,
  })

  const formValues = watch()

  const [sections, setSections] = useState<Section[]>([
    { id: "theme", title: "Theme & Style", icon: "🎨", open: true },
    { id: "couple", title: "The Couple", icon: "💑", open: true },
    { id: "event", title: "Event Details", icon: "📅", open: true },
    { id: "story", title: "Story & Culture", icon: "✨", open: false },
    { id: "message", title: "Message & RSVP", icon: "💌", open: false },
    { id: "gallery", title: "Gallery & Music", icon: "🖼️", open: false },
  ])

  const toggleSection = useCallback((id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s)))
  }, [])

  // Sync form changes to parent — only when values actually differ
  const prevRef = useRef<string>("")
  useEffect(() => {
    const vals = getValues()
    if (!vals.brideName && !vals.groomName) return
    const key = JSON.stringify(vals)
    if (key !== prevRef.current) {
      prevRef.current = key
      onChange(vals)
    }
  }, [formValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyTemplate = useCallback((key: TemplateKey) => {
    const t = templates[key]
    if (!t) return
    setValue("templateKey", key)
    setValue("themeKey", t.theme)
    setValue("fontKey", t.font)
    setValue("brideName", t.bride)
    setValue("groomName", t.groom)
    setValue("headline", t.headline)
    setValue("message", t.message)
    setValue("familyNames", t.familyNames)
    setValue("venueName", t.venueName)
    setValue("venueAddress", t.venueAddress)
    setValue("dressCode", t.dressCode)
    setValue("musicTitle", t.musicTitle)
    setValue("musicArtist", t.musicArtist)
    setValue("storyTitle", t.storyTitle || "")
    setValue("storyText", t.storyText || "")
    setValue("mealOptions", t.mealOptions || "")
    setValue("scheduleText", t.scheduleText || "")
    setValue("eventSeriesTitle", t.eventSeriesTitle || "")
    setValue("eventSeriesText", t.eventSeriesText || "")
    setValue("primaryLanguage", t.primaryLanguage || "en")
    setValue("secondaryLanguage", t.secondaryLanguage || "")
  }, [setValue])

  const themeKey = (formValues.themeKey || "gold") as ThemeKey
  const theme = themes[themeKey]

  return (
    <div>
      {/* Template presets */}
      <div className={`border-b px-6 py-4 ${isLight ? "border-neutral-200" : ""}`} style={sectionBorderStyle}>
        <p className={quickLabelClass} style={quickLabelStyle}>
          Quick Templates
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.values(templates) as TemplateConfig[]).map((t) => {
            const isActive = formValues.templateKey === t.key
            const accent = themes[t.theme].accent
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => applyTemplate(t.key)}
                className={`rounded-lg border px-2 py-2.5 text-left text-[11px] font-medium leading-tight transition-all duration-300 ${
                  isLight ? "" : ""
                }`}
                style={{
                  background: isActive ? `${accent}18` : isLight ? "#f5f5f5" : "rgba(255,255,255,0.12)",
                  borderColor: isActive ? accent : isLight ? "#e5e5e5" : "rgba(201,168,76,0.3)",
                  color: isActive ? accent : isLight ? "#404040" : "inherit",
                }}
              >
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accordion sections */}
      <AnimatePresence>
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className={`border-b ${isLight ? "border-neutral-200" : ""}`}
            style={sectionBorderStyle}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className={`flex w-full select-none items-center justify-between px-6 py-4 transition-colors ${
                isLight ? "hover:bg-neutral-50" : "hover:bg-white/5"
              }`}
            >
              <span className={sectionLabelClass} style={sectionLabelStyle}>
                {section.icon} {section.title}
              </span>
              {section.open ? (
                <ChevronUp size={14} className={isLight ? "text-indigo-600" : "text-gold-400"} />
              ) : (
                <ChevronDown size={14} className={isLight ? "text-indigo-600" : "text-gold-400"} />
              )}
            </button>

            <motion.div
              initial={false}
              animate={{ maxHeight: section.open ? 2000 : 0, opacity: section.open ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 flex flex-col gap-3.5">
                {section.id === "theme" && (
                  <>
                    {/* Theme swatches */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {(Object.values(themes) as any[]).map((t: any) => {
                        const isActive = formValues.themeKey === t.key
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => {
                              setValue("themeKey", t.key)
                            }}
                            className="p-3 rounded-xl border-2 transition-all duration-300 relative"
                            style={{
                              background: t.cardFront,
                              borderColor: isActive ? t.accent : "transparent",
                            }}
                          >
                            {isActive && (
                              <span className="absolute top-2 right-2 text-xs" style={{ color: t.accent }}>✓</span>
                            )}
                            <div
                              className="w-7 h-3 rounded-full mb-1.5"
                              style={{ background: `linear-gradient(90deg, ${t.bg}, ${t.accent})` }}
                            />
                            <span className="text-[10px] font-medium tracking-wide font-sans" style={{ color: "rgba(255,255,255,0.8)" }}>
                              {t.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <Select label="Font Style" tone={inputTone} {...register("fontKey")}>
                      <option value="cormorant">Cormorant Garamond (Elegant)</option>
                      <option value="cinzel">Cinzel (Classic)</option>
                      <option value="lato">Lato (Modern)</option>
                    </Select>

                    <Input tone={inputTone} label="Cover Image URL (optional)" {...register("coverImage")} type="url" placeholder="https://..." />
                  </>
                )}

                {section.id === "couple" && (
                  <>
                    <Input tone={inputTone} label="Bride's Name" {...register("brideName")} placeholder="Sophia" />
                    {errors.brideName && <p className="text-red-400 text-[10px]">{errors.brideName.message}</p>}

                    <Input tone={inputTone} label="Groom's Name" {...register("groomName")} placeholder="Alexander" />
                    {errors.groomName && <p className="text-red-400 text-[10px]">{errors.groomName.message}</p>}

                    <Input tone={inputTone} label="Wedding Headline" {...register("headline")} placeholder="Together Forever" />
                    <Input tone={inputTone} label="Secondary Headline" {...register("secondaryHeadline")} placeholder="Ek nayi shuruaat" />
                    <Input tone={inputTone} label="Family Names" {...register("familyNames")} placeholder="The Andersons & The Millers" />
                  </>
                )}

                {section.id === "event" && (
                  <>
                    <Input tone={inputTone} label="Wedding Date" {...register("eventDate")} type="date" />
                    {errors.eventDate && <p className="text-red-400 text-[10px]">{errors.eventDate.message}</p>}

                    <Input tone={inputTone} label="Ceremony Time" {...register("eventTime")} placeholder="4:00 PM" />
                    {errors.eventTime && <p className="text-red-400 text-[10px]">{errors.eventTime.message}</p>}

                    <Input tone={inputTone} label="Venue Name" {...register("venueName")} placeholder="The Grand Ballroom" />
                    {errors.venueName && <p className="text-red-400 text-[10px]">{errors.venueName.message}</p>}

                    <Input tone={inputTone} label="Venue Address" {...register("venueAddress")} placeholder="123 Rose Garden Lane, NY" />

                    <Input tone={inputTone} label="Google Maps Link (optional)" {...register("googleMapsLink")} type="url" placeholder="https://maps.google.com/..." />
                    {errors.googleMapsLink && <p className="text-red-400 text-[10px]">Enter a valid URL starting with https://</p>}
                    {errors.venueAddress && <p className="text-red-400 text-[10px]">{errors.venueAddress.message}</p>}

                    <Input tone={inputTone} label="Dress Code" {...register("dressCode")} placeholder="Black Tie Formal" />
                  </>
                )}

                {section.id === "story" && (
                  <>
                    <Select tone={inputTone} label="Primary Language" {...register("primaryLanguage")}>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ur">Urdu</option>
                      <option value="mr">Marathi</option>
                      <option value="gu">Gujarati</option>
                    </Select>

                    <Select tone={inputTone} label="Secondary Language (optional)" {...register("secondaryLanguage")}>
                      <option value="">None</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ur">Urdu</option>
                      <option value="mr">Marathi</option>
                      <option value="gu">Gujarati</option>
                    </Select>

                    <Input tone={inputTone} label="Love Story Title" {...register("storyTitle")} placeholder="How our forever began" />
                    <Textarea tone={inputTone} label="Love Story" {...register("storyText")} placeholder="Tell guests how you met, your proposal story, or what this day means to you." className="min-h-[90px]" />
                    <Input tone={inputTone} label="Secondary Story Title" {...register("secondaryStoryTitle")} placeholder="Hamari kahani" />
                    <Textarea tone={inputTone} label="Secondary Story" {...register("secondaryStoryText")} placeholder="Add a translated or alternate language version for family and guests." className="min-h-[90px]" />
                  </>
                )}

                {section.id === "message" && (
                  <>
                    <Textarea tone={inputTone} label="Invitation Message" {...register("message")} placeholder="Together with their families..." className="min-h-[80px]" />
                    <Textarea tone={inputTone} label="Secondary Message" {...register("secondaryMessage")} placeholder="Optional translated message for multilingual invitations." className="min-h-[80px]" />
                    <Input tone={inputTone} label="RSVP Contact" {...register("rsvpContact")} placeholder="+1 (555) 000-0000" />
                    <Input tone={inputTone} label="RSVP Deadline" {...register("rsvpDeadline")} placeholder="Please RSVP by October 1st" />
                    <Input tone={inputTone} label="Meal Options" {...register("mealOptions")} placeholder="Vegetarian, Non-Vegetarian, Vegan" />
                    <Textarea tone={inputTone} label="Event Schedule" {...register("scheduleText")} placeholder={"4:00 PM | Guests Arrive\n4:30 PM | Ceremony\n6:00 PM | Dinner & Dancing"} className="min-h-[100px]" />
                  </>
                )}

                {section.id === "gallery" && (
                  <>
                    <Textarea tone={inputTone} label="Story Gallery" {...register("galleryText")} placeholder={"https://image1.jpg | The day we got engaged\nhttps://image2.jpg | Our favorite sunset together"} className="min-h-[100px]" />
                    <Input tone={inputTone} label="Event Series Title" {...register("eventSeriesTitle")} placeholder="Wedding Week Celebrations" />
                    <Textarea tone={inputTone} label="Multi-Event Timeline" {...register("eventSeriesText")} placeholder={"Mehndi | 12 Dec 2026 | 5:00 PM | Jasmine Courtyard\nSangeet | 13 Dec 2026 | 7:00 PM | Sapphire Hall\nWedding | 14 Dec 2026 | 11:00 AM | Noor Palace"} className="min-h-[100px]" />
                    <Input tone={inputTone} label="Music Title" {...register("musicTitle")} placeholder="A Thousand Years" />
                    <Input tone={inputTone} label="Artist" {...register("musicArtist")} placeholder="Christina Perri" />
                    <Input tone={inputTone} label="Audio URL (mp3/ogg)" {...register("musicUrl")} type="url" placeholder="https://example.com/song.mp3" />
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Actions */}
      <div className={`border-t p-6 ${isLight ? "border-neutral-200 bg-neutral-50/50" : ""}`} style={sectionBorderStyle}>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            tone={isLight ? "light" : "dark"}
            onClick={onSave}
            disabled={saving}
            className="flex-1"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          {onPublish && (
            <Button
              variant="primary"
              size="sm"
              tone={isLight ? "light" : "dark"}
              onClick={onPublish}
              disabled={saving}
              className="flex-1"
            >
              <Globe size={14} />
              {isPublished ? "Published ✓" : "Publish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
