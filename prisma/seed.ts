import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import * as path from "path"

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "admin@sikanderkumbhar.com"
  const adminPassword = "Admin@123456"

  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log("Admin user already exists:", adminEmail)
    return
  }

  // Create admin user
  const hash = await bcrypt.hash(adminPassword, 12)
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin",
      passwordHash: hash,
      role: "admin",
    },
  })

  console.log("Admin user created:", admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
