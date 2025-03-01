import { expect, test } from "@playwright/test";

test.describe("Public Pages", () => {
  test("Home page loads correctly", async ({ page }) => {
    await page.goto("/");

    // Check the page title and hero section
    await expect(page.locator('h1:has-text("hero.title")')).toBeVisible();

    // Check for main buttons
    await expect(
      page.locator('a:has-text("hero.exploreServices")')
    ).toBeVisible();
    await expect(page.locator('a:has-text("hero.contactSales")')).toBeVisible();

    // Verify navigation is present
    await expect(page.locator("nav")).toBeVisible();
  });

  test("About page loads correctly", async ({ page }) => {
    await page.goto("/about");

    // Check for main title
    await expect(page.locator("h1")).toContainText("About");

    // Check that features sections are visible
    await expect(page.locator(".grid.gap-8")).toBeVisible();

    // Count feature boxes
    const featureCount = await page
      .locator(".relative.p-6.rounded-2xl")
      .count();
    expect(featureCount).toBe(4);
  });

  test("Contact page loads and form works", async ({ page }) => {
    await page.goto("/contact");

    // Check for form elements
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();

    // Fill out the form
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="company"]', "Test Company");
    await page.click("text=Select an interest");
    await page.click("text=SOC");
    await page.fill('textarea[name="message"]', "This is a test message");

    // Submit form (but intercept the actual submission)
    await page.route("**/api/send", (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    );
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator("text=Message sent successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Legal page displays all sections", async ({ page }) => {
    await page.goto("/legal");

    // Check for main title
    await expect(page.locator("h1")).toContainText("Legal");

    // Verify all legal sections are present
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
