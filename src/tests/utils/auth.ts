import { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation to complete
  await page.waitForURL("**/dashboard");
}

export async function logout(page: Page) {
  // Assuming there's a user menu that has to be clicked to reveal the logout button
  await page.click('[aria-label="User menu"]');
  await page.click("text=Sign out");
  // Wait for navigation to complete
  await page.waitForURL("**/");
}

export async function register(
  page: Page,
  fullName: string,
  email: string,
  password: string
) {
  await page.goto("/auth/register");
  await page.fill('input[name="fullName"]', fullName);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  // Wait for confirmation message
  await page.waitForSelector("text=Please check your email");
}
