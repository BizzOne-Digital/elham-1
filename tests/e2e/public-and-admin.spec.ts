import { test, expect } from "@playwright/test";

test.describe("admin authentication", () => {
  test("redirects unauthenticated users away from admin dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("shows login form and rejects invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /sign in|log in|login/i })).toBeVisible();

    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/password/i).fill("wrong-password");
    await page.getByRole("button", { name: /sign in|log in|continue/i }).click();

    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("public form submission", () => {
  test("accepts a valid contact API submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Playwright Test",
        email: `playwright-${Date.now()}@example.com`,
        message: "This is a test contact submission from Playwright.",
        source: "e2e-test",
      },
    });

    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test("rejects invalid contact payloads", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "A",
        email: "not-an-email",
        message: "short",
      },
    });

    expect(response.status()).toBe(422);
  });
});
