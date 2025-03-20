import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Password123!";

  test("Register new account", async ({ page }) => {
    await page.goto("/auth/register");

    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    await page.fill('input[name="fullName"]', "Test User");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    await page.route("**/auth/sign-up", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ user: { email: testEmail }, session: null }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Please check your email")).toBeVisible();
  });

  test("Login with valid credentials", async ({ page }) => {
    await page.route("**/auth/sign-in-with-password", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { email: "admin@example.com", id: "123" },
          session: { access_token: "fake-token" },
        }),
      });
    });

    await page.goto("/auth/login");

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "password123");

    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard");
  });

  test("Forgot password flow", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    await expect(page.locator('input[name="email"]')).toBeVisible();

    await page.fill('input[name="email"]', "admin@example.com");

    await page.route("**/api/auth/forgot-password", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Check your email")).toBeVisible();
  });
});
