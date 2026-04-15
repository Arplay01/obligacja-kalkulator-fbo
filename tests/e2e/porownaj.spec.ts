import { expect, test, type Page } from "@playwright/test";

async function gotoComparison(page: Page) {
  await page.goto("/porownaj");
  await page.waitForLoadState("networkidle");
}

async function gotoCalculator(page: Page) {
  await page.goto("/kalkulator");
  await page.waitForLoadState("networkidle");
}

async function settleVisualState(page: Page) {
  await expect(page.locator("[data-comparison-chart-helper]")).toBeVisible();
  await expect(page.locator("[data-comparison-recommendation]")).toBeVisible();
  await page.waitForTimeout(1800);
}

test.describe("/porownaj", () => {
  test("renders default state with recommendation and chart", async ({
    page,
  }) => {
    await gotoComparison(page);

    await expect(page.locator("[data-comparison-page]")).toBeVisible();
    await expect(page.locator("[data-comparison-chart]")).toBeVisible();
    await expect(page.locator("[data-comparison-recommendation]")).toBeVisible();
    await expect(page.locator("[data-comparison-amount-summary]")).toHaveText(
      "10 000 zł",
    );
    await expect(page.locator("[data-comparison-horizon-summary]")).toHaveText(
      "10 lat",
    );

    await expect(page.locator('[data-instrument-toggle="EDO"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator('[data-instrument-toggle="COI"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("shows interactive controls and mode toggle", async ({ page }) => {
    await gotoComparison(page);

    await expect(page.locator('[data-mode-toggle="net"]')).toBeVisible();
    await expect(page.locator('[data-effort-row="EDO"]')).toBeVisible();
  });

  test("integrates routes between /kalkulator and /porownaj", async ({
    page,
  }) => {
    await gotoCalculator(page);

    const softEntryLink = page.getByRole("link", {
      name: /Zobacz pełne porównanie ścieżek/i,
    });

    if (await softEntryLink.isVisible()) {
      await softEntryLink.click();
      await expect(page).toHaveURL(/\/porownaj$/);
    } else {
      await page.goto("/porownaj");
    }

    await expect(page.locator("[data-comparison-page]")).toBeVisible();

    await page.getByRole("link", { name: "Obliczam" }).click();
    await expect(page).toHaveURL(/\/kalkulator$/);
    await expect(page.locator('[data-value="netProfit"]')).toBeVisible();

    await page.getByRole("link", { name: /Porównuję/i }).click();
    await expect(page).toHaveURL(/\/porownaj$/);
    await expect(page.locator("[data-comparison-page]")).toBeVisible();
  });

  test("matches visual baseline for desktop default", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);

    await expect(page).toHaveScreenshot("porownaj-desktop-default.png", {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
    });
  });

  test("matches first fold on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);

    await expect(page).toHaveScreenshot("porownaj-mobile-first-fold.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("matches first fold on tablet portrait", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);

    await expect(page).toHaveScreenshot("porownaj-tablet-first-fold.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});
