import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const prisma = new PrismaClient()

type Row = Record<string, unknown>

type ExportedData = {
  users: Row[]
  invitations: Row[]
  gallery_images: Row[]
  rsvps: Row[]
  whatsapp_message_logs: Row[]
  invitation_views: Row[]
  guestbook_entries: Row[]
  schedule_items: Row[]
  mobile_sessions: Row[]
}

const tables = [
  "users",
  "invitations",
  "gallery_images",
  "rsvps",
  "whatsapp_message_logs",
  "invitation_views",
  "guestbook_entries",
  "schedule_items",
  "mobile_sessions",
] as const

const dateFields = new Set([
  "createdAt",
  "updatedAt",
  "eventDate",
  "checkedInAt",
  "lastReminderSentAt",
  "lastUpdateSentAt",
  "sentAt",
  "viewedAt",
  "expiresAt",
])

const booleanFields = new Set(["isPublished", "whatsappConsent"])

function normalizeRow(row: Row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => {
      if (value === null) return [key, null]
      if (dateFields.has(key) && (typeof value === "string" || typeof value === "number")) return [key, new Date(value)]
      if (booleanFields.has(key)) return [key, Boolean(value)]
      return [key, value]
    }),
  )
}

function readSqlite(sqlitePath: string): ExportedData {
  const python = String.raw`
import json
import sqlite3
import sys

db_path = sys.argv[1]
tables = sys.argv[2:]
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()
out = {}
for table in tables:
    exists = cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)).fetchone()
    out[table] = [] if not exists else [dict(row) for row in cur.execute(f"SELECT * FROM {table}").fetchall()]
print(json.dumps(out))
`

  const output = execFileSync("python3", ["-c", python, sqlitePath, ...tables], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 50,
  })

  return JSON.parse(output) as ExportedData
}

async function createMany(label: string, rows: Row[], create: (data: Row[]) => Promise<{ count: number }>) {
  if (rows.length === 0) {
    console.log(`${label}: 0 rows`)
    return
  }

  const result = await create(rows.map(normalizeRow))
  console.log(`${label}: ${result.count}/${rows.length} inserted`)
}

async function main() {
  const sqlitePath = path.resolve(process.cwd(), "prisma/dev.db")
  if (!existsSync(sqlitePath)) {
    throw new Error(`SQLite source database not found: ${sqlitePath}`)
  }

  if (!process.env.DATABASE_URL?.startsWith("mysql://")) {
    throw new Error("DATABASE_URL must point to the target MySQL database")
  }

  const data = readSqlite(sqlitePath)

  await createMany("users", data.users, (rows) => prisma.user.createMany({ data: rows as never, skipDuplicates: true }))
  await createMany("invitations", data.invitations, (rows) =>
    prisma.invitation.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("gallery_images", data.gallery_images, (rows) =>
    prisma.galleryImage.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("rsvps", data.rsvps, (rows) => prisma.rsvp.createMany({ data: rows as never, skipDuplicates: true }))
  await createMany("whatsapp_message_logs", data.whatsapp_message_logs, (rows) =>
    prisma.whatsAppMessageLog.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("invitation_views", data.invitation_views, (rows) =>
    prisma.invitationView.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("guestbook_entries", data.guestbook_entries, (rows) =>
    prisma.guestbookEntry.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("schedule_items", data.schedule_items, (rows) =>
    prisma.scheduleItem.createMany({ data: rows as never, skipDuplicates: true }),
  )
  await createMany("mobile_sessions", data.mobile_sessions, (rows) =>
    prisma.mobileSession.createMany({ data: rows as never, skipDuplicates: true }),
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
