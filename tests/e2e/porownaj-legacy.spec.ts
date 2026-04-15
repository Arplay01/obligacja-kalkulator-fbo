import { expect, test, type Page } from "@playwright/test";

async function gotoLegacyComparison(page: Page) {
  await page.goto("/porownaj-przed-ui-polishingiem");
  await page.waitForLoadState("networkidle");
}

async function settleLegacyVisualState(page: Page) {
  await expect(page.locator("[data-comparison-legacy-stamp]")).toBeVisible();
  await expect(page.locator("[data-comparison-chart]")).toBeVisible();
  await page.waitForTimeout(1800);
}

test.describe("/porownaj-przed-ui-polishingiem", () => {
  test("renders archived snapshot marker and legacy comparison shell", async ({
    page,
  }) => {
    await gotoLegacyComparison(page);

    await expect(page.locator("[data-comparison-legacy-page]")).toBeVisible();
    await expect(page.locator("[data-comparison-legacy-stamp]")).toContainText(
      "Archiwalny snapshot",
    );
    await expect(page.locator("[data-comparison-page]")).toBeVisible();
    await expect(page.locator("[data-comparison-chart]")).toBeVisible();
    await expect(page.locator("[data-comparison-recommendation]")).toBeVisible();
  });

  test("navigates between calculator, current comparison and legacy comparison", async ({
    page,
  }) => {
    await page.goto("/kalkulator");
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("link", { name: "Porównaj - przed UI polishingiem" })
      .click();
    await expect(page).toHaveURL(/\/porownaj-przed-ui-polishingiem$/);
    await expect(page.locator("[data-comparison-legacy-page]")).toBeVisible();

    await page.getByRole("link", { name: /Porównuję/i }).click();
    await expect(page).toHaveURL(/\/porownaj$/);
    await expect(page.locator("[data-comparison-page]")).toBeVisible();

    await page.getByRole("link", { name: "Obliczam" }).click();
    await expect(page).toHaveURL(/\/kalkulator$/);
    await expect(page.locator('[data-value="netProfit"]')).toBeVisible();
  });

  test("matches visual baseline for legacy desktop default", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoLegacyComparison(page);
    await settleLegacyVisualState(page);

    await expect(page).toHaveScreenshot("porownaj-legacy-desktop-default.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});
