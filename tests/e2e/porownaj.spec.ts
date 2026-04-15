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

async function scrollComparisonMain(page: Page, top: number) {
  await page.locator("[data-comparison-main-scroll]").evaluate(
    (node, nextTop) => {
      node.scrollTop = nextTop;
    },
    top,
  );
}

async function scrollComparisonSidebar(page: Page, top: number) {
  await page.locator("[data-comparison-sidebar-scroll]").evaluate(
    (node, nextTop) => {
      node.scrollTop = nextTop;
    },
    top,
  );
}

async function setComparisonHorizon(page: Page, years: number) {
  await page.locator("#comparison-horizon-slider").evaluate(
    (node, nextYears) => {
      const input = node as HTMLInputElement;
      input.value = String(nextYears);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    years,
  );
}

test.describe("/porownaj", () => {
  test("renders default state with recommendation and chart", async ({
    page,
  }) => {
    await gotoComparison(page);

    await expect(page.locator("[data-comparison-page]")).toBeVisible();
    await expect(page.locator("[data-comparison-chart]")).toBeVisible();
    await expect(page.locator("[data-comparison-recommendation]")).toBeVisible();
    await expect(page.locator("[data-comparison-recommendation]")).toContainText(
      "Dlaczego właśnie ta opcja",
    );
    await expect(page.locator("[data-comparison-recommendation]")).toContainText(
      "Jeśli nic nie zrobisz",
    );
    await expect(page.locator("[data-comparison-recommendation]")).toContainText(
      "Dlaczego lokata przegrywa",
    );
    await expect(page.locator("[data-comparison-chart-helper]")).toBeVisible();
    await expect(page.locator("[data-comparison-chart-helper]")).not.toContainText(
      "Półprzezroczysta kropka oznacza wypłatę z obligacji.",
    );
    await expect(page.locator("[data-effort-section]")).toContainText(
      "Ile razy trzeba się tym zająć",
    );
    await expect(page.locator('[data-effort-row="COI"]')).toContainText(
      "odsetki z COI wpadają co roku na konto",
    );
    await expect(page.locator("[data-challenge-cta]")).toContainText(
      "Jak kupić pierwsze obligacje?",
    );
    await expect(page.locator("[data-challenge-cta-link]")).toHaveText(
      "Dołącz do wyzwania",
    );
    await expect(page.locator("[data-comparison-horizon-summary]")).toHaveText(
      "10 lat",
    );

    await expect(
      page.locator('[data-instrument-toggle="EDO"]:visible'),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('[data-instrument-toggle="COI"]:visible'),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("shows interactive controls and mode toggle", async ({ page }) => {
    await gotoComparison(page);

    await expect(page.locator('[data-mode-toggle="net"]')).toBeVisible();
    await expect(page.locator('[data-effort-row="EDO"]')).toBeVisible();
  });

  test("keeps header and sidebar fixed while only main region scrolls on wide layout", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await gotoComparison(page);

    const header = page.locator("[data-comparison-header]");
    const sidebarScroll = page.locator("[data-comparison-sidebar-scroll]");
    const mainScroll = page.locator("[data-comparison-main-scroll]");

    await expect(header).toBeVisible();
    await expect(sidebarScroll).toBeVisible();
    await expect(mainScroll).toBeVisible();

    const headerTopBefore = await header.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );
    const sidebarTopBefore = await sidebarScroll.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );

    await scrollComparisonMain(page, 960);

    await expect
      .poll(async () =>
        mainScroll.evaluate((node) => Math.round(node.scrollTop)),
      )
      .toBeGreaterThan(200);
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0);

    const headerTopAfter = await header.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );
    const sidebarTopAfter = await sidebarScroll.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );

    expect(headerTopAfter).toBe(headerTopBefore);
    expect(sidebarTopAfter).toBe(sidebarTopBefore);
  });

  test("scrolls the left controls inside the card box without moving the left rail", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await gotoComparison(page);

    await page
      .getByRole("button", { name: /Więcej opcji/i })
      .click();

    const sidebarScroll = page.locator("[data-comparison-sidebar-scroll]");
    const mainScroll = page.locator("[data-comparison-main-scroll]");
    const sidebarTopBefore = await sidebarScroll.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );

    await scrollComparisonSidebar(page, 480);

    await expect
      .poll(async () =>
        sidebarScroll.evaluate((node) => Math.round(node.scrollTop)),
      )
      .toBeGreaterThan(0);
    await expect
      .poll(async () => mainScroll.evaluate((node) => Math.round(node.scrollTop)))
      .toBe(0);

    const sidebarTopAfter = await sidebarScroll.evaluate((node) =>
      Math.round(node.getBoundingClientRect().top),
    );

    expect(sidebarTopAfter).toBe(sidebarTopBefore);
  });

  test("keeps the smart suggestion visible and toggles between enabling and disabling it", async ({
    page,
  }) => {
    await gotoComparison(page);
    await setComparisonHorizon(page, 3);
    await expect(page.locator("[data-comparison-horizon-summary]")).toHaveText(
      "3 lata",
    );

    const smartSuggestion = page.locator("[data-comparison-smart-suggestion]");
    const smartSuggestionToggle = page.locator(
      "[data-comparison-smart-suggestion-toggle]",
    );

    await expect(smartSuggestion).toContainText("TOS 3-letnie");
    await expect(smartSuggestionToggle).toHaveText("Włącz");

    await smartSuggestionToggle.click();

    await expect(smartSuggestion).toContainText("TOS 3-letnie");
    await expect(smartSuggestionToggle).toHaveText("Wyłącz");

    await smartSuggestionToggle.click();

    await expect(smartSuggestion).toContainText("TOS 3-letnie");
    await expect(smartSuggestionToggle).toHaveText("Włącz");
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
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);

    await expect(page).toHaveScreenshot("porownaj-desktop-default.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("matches dashboard shell after main panel scroll on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);
    await scrollComparisonMain(page, 960);

    await expect(page).toHaveScreenshot("porownaj-desktop-scrolled-shell.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("matches dashboard shell on tablet landscape", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoComparison(page);
    await settleVisualState(page);

    await expect(page).toHaveScreenshot(
      "porownaj-tablet-landscape-shell.png",
      {
        animations: "disabled",
        caret: "hide",
      },
    );
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
