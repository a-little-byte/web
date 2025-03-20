import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.cookie =
      "auth-token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJyb2xlIjoidXNlciJ9.fake-signature;path=/;";
  });

  await page.route("**/api/**", (route) => {
    if (route.request().url().includes("user")) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: "123456",
          email: "user@example.com",
          full_name: "Test User",
        }),
      });
    }
    if (route.request().url().includes("subscriptions")) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: "sub_123",
            status: "active",
            current_period_start: "2023-01-01",
            current_period_end: "2024-01-01",
            services: { name: "Premium Plan", price: 99.99, period: "monthly" },
          },
        ]),
      });
    }
    return route.continue();
  });
});

test.describe("Dashboard Pages", () => {
  test("Dashboard overview loads correctly", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.locator("h1")).toContainText("Dashboard");

    await expect(page.locator("text=Active Subscriptions")).toBeVisible();
    await expect(page.locator("text=Total Spent")).toBeVisible();

    await expect(page.locator('nav a:has-text("Overview")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Subscriptions")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Settings")')).toBeVisible();
  });

  test("Subscriptions page loads correctly", async ({ page }) => {
    await page.goto("/dashboard/subscriptions");

    await expect(page.locator("h1")).toContainText("Subscriptions");

    await expect(page.locator("text=Filter")).toBeVisible();

    await expect(page.locator("table")).toBeVisible();
  });

  test("Settings page loads and displays tabs", async ({ page }) => {
    await page.goto("/dashboard/settings");

    await expect(page.locator("h1")).toContainText("Settings");

    await expect(page.locator('button:has-text("Profile")')).toBeVisible();
    await expect(page.locator('button:has-text("Password")')).toBeVisible();
    await expect(page.locator('button:has-text("Danger")')).toBeVisible();

    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();

    await page.click('button:has-text("Password")');
    await expect(page.locator('input[name="currentPassword"]')).toBeVisible();

    await page.click('button:has-text("Danger")');
    await expect(
      page.locator('button:has-text("Delete Account")')
    ).toBeVisible();
  });
});
