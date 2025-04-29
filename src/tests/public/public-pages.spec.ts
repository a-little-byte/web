import { expect, test } from "@playwright/test";

test.describe("Public Pages", () => {
  test("Home page loads correctly", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();

    await expect(page.locator('a[href="/services"]')).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();

    await expect(page.locator("nav")).toBeVisible();
  });

  test("About page loads correctly", async ({ page }) => {
    await page.goto("/about");

    await expect(page.locator("h1")).toContainText("About");

    await expect(page.locator(".grid")).toBeVisible();

    const featureCount = await page.locator(".rounded-2xl").count();
    expect(featureCount).toBeGreaterThan(0);
  });

  test("Contact page loads and form works", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();

    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="company"]', "Test Company");

    const selectButton = page.locator('[role="combobox"]').first();
    await selectButton.click();
    await page.getByRole("option").filter({ hasText: /SOC/i }).click();

    await page.fill('textarea[name="message"]', "This is a test message");

    await page.route("**/api/send", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    );
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Message sent successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Legal page displays all sections", async ({ page }) => {
    await page.goto("/legal");

    await expect(page.locator("h1")).toContainText("Legal");

    await expect(page.locator(".prose")).toBeVisible();
  });

  test("Privacy page displays all privacy sections", async ({ page }) => {
    await page.goto("/privacy");

    await expect(page.locator("h1")).toContainText("Privacy");

    await expect(page.locator(".prose")).toBeVisible();
  });
});
