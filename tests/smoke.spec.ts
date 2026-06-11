import { expect, test } from "@playwright/test"

test("home page loads primary navigation", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Premium Wedding Invitation Builder/i)
  await expect(page.getByRole("heading", { name: /Premium Wedding Invitation Builder/i })).toBeVisible()
  await expect(page.getByRole("link", { name: /Start Creating/i })).toBeVisible()
  await expect(page.getByRole("link", { name: /View Templates/i })).toBeVisible()
})

test("sign in page exposes email and password fields", async ({ page }) => {
  await page.goto("/sign-in")

  await expect(page.getByRole("heading", { name: /Welcome Back/i })).toBeVisible()
  await expect(page.getByLabel(/Email/i)).toBeVisible()
  await expect(page.getByLabel(/Password/i)).toBeVisible()
  await expect(page.getByRole("button", { name: /Sign In/i })).toBeVisible()
})

test("stale auth cookie is treated as signed out on public pages", async ({ context, page }) => {
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: "stale-token-from-old-secret",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ])

  await page.goto("/")

  await expect(page.getByRole("heading", { name: /Premium Wedding Invitation Builder/i })).toBeVisible()
  await expect(page.getByRole("link", { name: /Start Creating/i })).toBeVisible()
})
