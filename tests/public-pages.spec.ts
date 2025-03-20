import { expect, test } from "@playwright/test";

test.describe("Public Pages", () => {
  test("Home page loads correctly", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('h1:has-text("hero.title")')).toBeVisible();

    await expect(
      page.locator('a:has-text("hero.exploreServices")')
    ).toBeVisible();
    await expect(page.locator('a:has-text("hero.contactSales")')).toBeVisible();

    await expect(page.locator("nav")).toBeVisible();
  });

  test("About page loads correctly", async ({ page }) => {
    await page.goto("/about");

    await expect(page.locator("h1")).toContainText("About");

    await expect(page.locator(".grid.gap-8")).toBeVisible();

    const featureCount = await page
      .locator(".relative.p-6.rounded-2xl")
      .count();
    expect(featureCount).toBe(4);
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
    await page.click("text=Select an interest");
    await page.click("text=SOC");
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

    const sections = [
      "Copyright",
      "Trademark",
      "Disclaimer",
      "Liability",
      "Export",
      "Governing",
      "Contact",
      "Changes",
    ];

    for (const section of sections) {
      await expect(page.locator(`h2:has-text("${section}")`)).toBeVisible();
    }
  });
});
