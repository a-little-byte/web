import { expect, test } from "@playwright/test";

// Setup admin auth state before tests
test.beforeEach(async ({ page }) => {
  // Set a fake auth cookie to simulate admin logged-in state
  await page.goto("/");
  await page.evaluate(() => {
    document.cookie =
      "auth-token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhZG1pbjEyMyIsInJvbGUiOiJhZG1pbiJ9.fake-admin-signature;path=/;";
  });

  // Mock API calls for admin data
  await page.route("**/api/**", (route) => {
    // Different responses based on the endpoint
    if (route.request().url().includes("/carousel")) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: "1",
            title: "Test Carousel Item",
            description: "Test description",
            image_url: "https://example.com/image.jpg",
            button_text: "Learn More",
            button_link: "/services",
            order: 1,
            active: true,
          },
        ]),
      });
    }
    if (route.request().url().includes("/services")) {
      return route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: "1",
            name: "Premium Service",
            description: "Enterprise security solution",
            price: 299.99,
            period: "monthly",
          },
        ]),
      });
    }
    return route.continue();
  });
});

test.describe("Admin Pages", () => {
  test("Admin dashboard loads correctly", async ({ page }) => {
    await page.goto("/admin");

    // Check page title
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Check for admin sidebar
    await expect(page.locator("nav")).toContainText("Admin Dashboard");
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('a:has-text("Services")')).toBeVisible();
    await expect(page.locator('a:has-text("Page Content")')).toBeVisible();

    // Check for dashboard charts and data
    await expect(page.locator("text=/Revenue/i")).toBeVisible();
  });

  test("Admin carousel management page works", async ({ page }) => {
    await page.goto("/admin/carousel");

    // Check page title and table
    await expect(page.locator("h1")).toContainText("Carousel Management");
    await expect(page.locator("table")).toBeVisible();

    // Check for carousel items in table
    await expect(
      page.locator('td:has-text("Test Carousel Item")')
    ).toBeVisible();

    // Test add new item dialog
    await page.click('button:has-text("Add New Item")');
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();

    // Fill the form (but don't submit to avoid actual API calls)
    await page.fill('input[name="title"]', "New Carousel Item");
    await page.fill('input[name="description"]', "New Description");
    await page.fill('input[name="image_url"]', "https://example.com/new.jpg");
    await page.fill('input[name="button_text"]', "Click Here");
    await page.fill('input[name="button_link"]', "/new-page");

    // Mock the API call for form submission
    await page.route("**/api/carousel", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, id: "new-id-123" }),
      });
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success toast or message
    await expect(page.locator("text=successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Admin services management page works", async ({ page }) => {
    await page.goto("/admin/services");

    // Check page title and table
    await expect(page.locator("h1")).toContainText("Services Management");
    await expect(page.locator("table")).toBeVisible();

    // Check for service items in table
    await expect(page.locator('td:has-text("Premium Service")')).toBeVisible();
    await expect(page.locator('td:has-text("$299.99")')).toBeVisible();

    // Test edit service
    await page.click('button:has-text("Edit")');
    await expect(page.locator('div[role="dialog"]')).toBeVisible();

    // Update a field
    await page.fill('input[name="name"]', "Updated Service Name");

    // Mock the API call for form submission
    await page.route("**/api/services/**", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator("text=updated successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Admin content management page works", async ({ page }) => {
    await page.goto("/admin/content");

    // Check page title and tabs
    await expect(page.locator("h1")).toContainText("Page Content");
    await expect(
      page.locator('button[role="tab"]:has-text("Hero")')
    ).toBeVisible();
    await expect(
      page.locator('button[role="tab"]:has-text("Features")')
    ).toBeVisible();
    await expect(
      page.locator('button[role="tab"]:has-text("CTA")')
    ).toBeVisible();

    // Test the hero tab form
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('input[name="description"]')).toBeVisible();

    // Fill form fields
    await page.fill('input[name="title"]', "New Hero Title");
    await page.fill('input[name="description"]', "New Hero Description");

    // Mock the API call
    await page.route("**/api/content", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator("text=Content updated successfully")).toBeVisible(
      { timeout: 3000 }
    );
  });
});
