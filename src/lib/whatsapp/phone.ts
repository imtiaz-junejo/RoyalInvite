export function normalizeWhatsappNumber(value: string | null | undefined) {
  const raw = String(value || "").trim()
  if (!raw) return null

  const hasPlus = raw.startsWith("+")
  const digits = raw.replace(/[^\d]/g, "")
  if (digits.length < 10) return null

  return hasPlus ? `+${digits}` : digits
}
