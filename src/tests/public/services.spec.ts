import { expect, test } from "@playwright/test";

test("Services page loads correctly", async ({ page }) => {
  await page.goto("/services");

  await expect(page.locator("h1")).toContainText("Security Solutions");

  await page.waitForLoadState("networkidle");

  await expect(page.locator(".container")).toBeVisible();
  await expect(page.locator(".grid")).toBeVisible();
});
