import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  // Generate a unique email for registration tests
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Password123!";

  test("Register new account", async ({ page }) => {
    await page.goto("/auth/register");

    // Check form elements
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Fill registration form
    await page.fill('input[name="fullName"]', "Test User");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    // Mock the registration API response
    await page.route("**/auth/sign-up", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ user: { email: testEmail }, session: null }),
      });
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Check for confirmation message
    await expect(page.locator("text=Please check your email")).toBeVisible();
  });

  test("Login with valid credentials", async ({ page }) => {
    // Mock auth API to allow login without real credentials
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

    // Check form elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    // Fill login form
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Check redirection to dashboard
    await page.waitForURL("**/dashboard");
  });

  test("Forgot password flow", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Check form elements
    await expect(page.locator('input[name="email"]')).toBeVisible();

    // Fill form
    await page.fill('input[name="email"]', "admin@example.com");

    // Mock the API response
    await page.route("**/api/auth/forgot-password", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Submit form
    await page.click('button[type="submit"]');

    // Check for confirmation
    await expect(page.locator("text=Check your email")).toBeVisible();
  });
});
