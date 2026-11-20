import { test, expect } from "@playwright/test";

test("testing homepage", async ({ page }) => {
  await page.goto("https://team-flow-mauve.vercel.app");

  await expect(page).toHaveTitle(/TeamFlow/i);
});

test("Login link should be visible", async ({ page }) => {
  await page.goto("https://team-flow-mauve.vercel.app");

  const loginLink = page.getByRole("button", {
    name: "Log in",
  });

  await expect(loginLink).toBeVisible();
});
