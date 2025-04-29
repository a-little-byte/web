import test, { expect } from "@playwright/test";

test("Products page loads correctly", async ({ page }) => {
  await page.goto("/products");

  await expect(page.locator("h1")).toContainText("Products");

  await page.waitForLoadState("networkidle");

  await expect(page.locator("p")).toBeVisible();

  await expect(page.locator(".container")).toBeVisible();
});
