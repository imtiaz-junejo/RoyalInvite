const DEFAULT_SESSION_ID = "eternally-yours-main"

function gatewayBaseUrl() {
  return (process.env.WHATSAPP_GATEWAY_URL || "http://127.0.0.1:3020").replace(/\/$/, "")
}

function gatewayHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = process.env.WHATSAPP_GATEWAY_INTERNAL_TOKEN || process.env.INTERNAL_TOKEN
  if (token) headers["X-Internal-Token"] = token
  return headers
}

export function getWhatsappSessionId() {
  return process.env.WHATSAPP_SESSION_ID || DEFAULT_SESSION_ID
}

export async function sendWhatsappMessage({ to, text }: { to: string; text: string }) {
  const response = await fetch(`${gatewayBaseUrl()}/internal/messages/send`, {
    method: "POST",
    headers: gatewayHeaders(),
    body: JSON.stringify({ session_id: getWhatsappSessionId(), to, text }),
    cache: "no-store",
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `gateway_http_${response.status}`)
  }

  return { messageId: payload.message_id || "" }
}

export async function getWhatsappSenderStatus() {
  const sessionId = getWhatsappSessionId()
  const response = await fetch(`${gatewayBaseUrl()}/internal/sessions/${encodeURIComponent(sessionId)}/status`, {
    headers: gatewayHeaders(),
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))

  return {
    ok: response.ok && payload.ok !== false,
    sessionId,
    status: payload.status || "unknown",
    lastEventAt: payload.last_event_at || null,
    error: payload.error || null,
  }
}

export async function connectWhatsappSender() {
  const sessionId = getWhatsappSessionId()
  const response = await fetch(`${gatewayBaseUrl()}/internal/sessions/connect`, {
    method: "POST",
    headers: gatewayHeaders(),
    body: JSON.stringify({ session_id: sessionId }),
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.ok === false) throw new Error(payload.error || `gateway_http_${response.status}`)
  return payload
}

export async function getWhatsappSenderQr() {
  const sessionId = getWhatsappSessionId()
  const response = await fetch(`${gatewayBaseUrl()}/internal/sessions/${encodeURIComponent(sessionId)}/qr`, {
    headers: gatewayHeaders(),
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.ok === false) throw new Error(payload.error || `gateway_http_${response.status}`)
  return payload
}

export async function disconnectWhatsappSender() {
  const sessionId = getWhatsappSessionId()
  const response = await fetch(`${gatewayBaseUrl()}/internal/sessions/${encodeURIComponent(sessionId)}/disconnect`, {
    method: "POST",
    headers: gatewayHeaders(),
    cache: "no-store",
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.ok === false) throw new Error(payload.error || `gateway_http_${response.status}`)
  return payload
}
