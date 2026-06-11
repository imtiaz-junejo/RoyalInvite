import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (process.env.APP_URL) return process.env.APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || Math.random().toString(36).slice(2, 8)
}

export interface ParsedScheduleItem {
  time: string
  event: string
}

export interface ParsedGalleryItem {
  url: string
  caption: string
}

export interface ParsedEventSeriesItem {
  label: string
  date: string
  time: string
  venue: string
}

export function parseScheduleText(value?: string): ParsedScheduleItem[] {
  if (!value?.trim()) return []

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [time, ...eventParts] = line.split("|")
      return {
        time: (time || "").trim(),
        event: eventParts.join("|").trim(),
      }
    })
    .filter((item) => item.time && item.event)
}

export function formatScheduleText(items: { time: string; event: string }[]): string {
  return items.map((item) => `${item.time} | ${item.event}`).join("\n")
}

export function parseMealOptions(value?: string): string[] {
  if (!value?.trim()) return []

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseGalleryText(value?: string): ParsedGalleryItem[] {
  if (!value?.trim()) return []

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, ...captionParts] = line.split("|")
      return {
        url: (url || "").trim(),
        caption: captionParts.join("|").trim(),
      }
    })
    .filter((item) => item.url)
}

export function parseEventSeriesText(value?: string): ParsedEventSeriesItem[] {
  if (!value?.trim()) return []

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, date, time, venue] = line.split("|").map((part) => part.trim())
      return { label: label || "", date: date || "", time: time || "", venue: venue || "" }
    })
    .filter((item) => item.label && item.date)
}
