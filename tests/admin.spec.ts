import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.cookie =
      "auth-token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhZG1pbjEyMyIsInJvbGUiOiJhZG1pbiJ9.fake-admin-signature;path=/;";
  });

  await page.route("**/api/**", (route) => {
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

    await expect(page.locator("h1")).toContainText("Dashboard");

    await expect(page.locator("nav")).toContainText("Admin Dashboard");
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('a:has-text("Services")')).toBeVisible();
    await expect(page.locator('a:has-text("Page Content")')).toBeVisible();

    await expect(page.locator("text=/Revenue/i")).toBeVisible();
  });

  test("Admin carousel management page works", async ({ page }) => {
    await page.goto("/admin/carousel");

    await expect(page.locator("h1")).toContainText("Carousel Management");
    await expect(page.locator("table")).toBeVisible();

    await expect(
      page.locator('td:has-text("Test Carousel Item")')
    ).toBeVisible();

    await page.click('button:has-text("Add New Item")');
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();

    await page.fill('input[name="title"]', "New Carousel Item");
    await page.fill('input[name="description"]', "New Description");
    await page.fill('input[name="image_url"]', "https://example.com/new.jpg");
    await page.fill('input[name="button_text"]', "Click Here");
    await page.fill('input[name="button_link"]', "/new-page");

    await page.route("**/api/carousel", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, id: "new-id-123" }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Admin services management page works", async ({ page }) => {
    await page.goto("/admin/services");

    await expect(page.locator("h1")).toContainText("Services Management");
    await expect(page.locator("table")).toBeVisible();

    await expect(page.locator('td:has-text("Premium Service")')).toBeVisible();
    await expect(page.locator('td:has-text("$299.99")')).toBeVisible();

    await page.click('button:has-text("Edit")');
    await expect(page.locator('div[role="dialog"]')).toBeVisible();

    await page.fill('input[name="name"]', "Updated Service Name");

    await page.route("**/api/services/**", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=updated successfully")).toBeVisible({
      timeout: 3000,
    });
  });

  test("Admin content management page works", async ({ page }) => {
    await page.goto("/admin/content");

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

    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('input[name="description"]')).toBeVisible();

    await page.fill('input[name="title"]', "New Hero Title");
    await page.fill('input[name="description"]', "New Hero Description");

    await page.route("**/api/content", (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Content updated successfully")).toBeVisible(
      { timeout: 3000 }
    );
  });
});
