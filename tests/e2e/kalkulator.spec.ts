import { expect, test, type Page } from "@playwright/test";

async function gotoCalculator(page: Page) {
  await page.goto("/kalkulator");
  await page.waitForLoadState("networkidle");
}

test.describe("kalkulator", () => {
  test("renders the final hero amount before client hydration", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await gotoCalculator(page);

    await expect(page.locator('[data-value=\"netProfit\"]')).toHaveText(
      /^\+1\s620,00 zł$/,
    );

    await context.close();
  });

  test("renders default state from the prototype logic", async ({ page }) => {
    await gotoCalculator(page);

    await expect(
      page.getByText("Nie wiesz, czym są obligacje? Przeczytaj w 30 sekund"),
    ).toBeVisible();
    await expect(
      page.locator('[data-bond-name]'),
    ).toHaveText("COI 4-letnie");
    await expect(page.locator('[data-value=\"netProfit\"]')).toHaveText(
      /^\+1\s620,00 zł$/,
    );
    await expect(page.locator("[data-bond-count]")).toHaveText(
      "100 obligacji po 100 zł",
    );
    await expect(page.locator("[data-result-bridge]")).toContainText(
      "Twoje 10 000 zł po 4 latach może dać 11 620 zł netto",
    );
    await expect(page.locator("[data-result-bridge]")).toContainText(
      "realnie stracisz 1 286 zł",
    );
    await expect(page.locator(".compare-section")).toHaveAttribute("open", "");
  });

  test("opens comparison settings from the compare helper", async ({ page }) => {
    await gotoCalculator(page);

    await page.getByRole("button", { name: /Zmień stawki w ustawieniach/i }).click();

    await expect(page.locator("#advanced-options")).toHaveAttribute("open", "");
    await expect(page.locator("#deposit-rate")).toBeFocused();
  });

  test("updates hero and NBP row visibility when bond changes", async ({ page }) => {
    await gotoCalculator(page);

    await page.getByRole("tab", { name: /ROR/i }).click();
    await expect(page.locator('[data-bond-name]')).toHaveText("ROR roczne");

    await page.getByText("Więcej opcji").click();
    await expect(page.locator('[data-row=\"nbp\"]')).not.toHaveClass(/is-hidden/);

    await page.getByRole("tab", { name: /COI/i }).click();
    await expect(page.locator('[data-row=\"nbp\"]')).toHaveClass(/is-hidden/);
  });

  test("keeps amount presets and input in sync", async ({ page }) => {
    await gotoCalculator(page);

    await page.getByRole("button", { name: "50 000" }).click();
    await expect(page.locator("#amount-input")).toHaveValue(/50\s000/);
    await expect(page.locator("[data-bond-count]")).toHaveText(
      "500 obligacji po 100 zł",
    );
  });

  test("keeps manual amount input formatted and synced after slider changes", async ({
    page,
  }) => {
    await gotoCalculator(page);

    await page.locator("#amount-slider").evaluate((element: HTMLInputElement) => {
      element.value = "850";
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const amountInput = page.locator("#amount-input");
    const sliderDrivenValue = await amountInput.inputValue();
    await amountInput.click();
    await expect(amountInput).toHaveValue(sliderDrivenValue);

    await amountInput.fill("100000000");
    await expect(amountInput).toHaveValue(/^100\s000\s000$/);
    await expect(page.locator("[data-bond-count]")).toHaveText(
      "1 000 000 obligacji po 100 zł",
    );
  });

  test("switches to custom inflation live", async ({ page }) => {
    await gotoCalculator(page);

    await page.getByText("Więcej opcji").click();
    await page.locator("#custom-inflation").fill("4,2");

    await expect(page.locator("[data-inflation-mode]")).toHaveCount(0);

    await page.getByRole("tab", { name: /TOS/i }).click();
    await expect(page.locator("[data-inflation-mode]")).toHaveText(
      "Aktywna własna inflacja: 4,20%",
    );
  });

  test("renders a chart for long series and an elegant empty state for short ones", async ({
    page,
  }) => {
    await gotoCalculator(page);

    await page.getByText("Wykres i tabela rok po roku").click();
    await expect(page.locator("[data-growth-chart]")).toBeVisible();
    await expect(page.locator("[data-growth-chart]")).toContainText(
      "Inflacja",
    );
    await expect(page.locator("[data-chart-helper]")).toContainText(
      "Linia inflacji pokazuje",
    );
    await expect(page.locator("[data-chart-empty]")).toHaveCount(0);

    await page.getByRole("tab", { name: /OTS/i }).click();
    await expect(page.locator("[data-chart-empty]")).toBeVisible();
    await expect(page.locator("[data-chart-empty]")).toContainText(
      "Za krótka symulacja na wykres liniowy",
    );
  });

  test("toggles IKE and updates helper text", async ({ page }) => {
    await gotoCalculator(page);

    await page.locator("#ike-toggle").click();

    await expect(page.locator("#ike-toggle")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.locator("[data-ike-helper]")).toContainText(
      "Oszczędzasz ok.",
    );
    await expect(page.locator('[data-value=\"tax\"]')).toHaveText("0,00 zł");
  });

  test("dispatches local close intent before standalone fallback", async ({ page }) => {
    await gotoCalculator(page);

    await page.evaluate(() => {
      (window as typeof window & { __closeEvents?: unknown[] }).__closeEvents = [];
      window.addEventListener("close-calculator", (event) => {
        event.preventDefault();
        (window as typeof window & { __closeEvents: unknown[] }).__closeEvents.push({
          type: event.type,
        });
      });
    });

    await page.getByRole("button", { name: /Wróć do portfolio/i }).click();

    await expect
      .poll(() =>
        page.evaluate(
          () => (window as typeof window & { __closeEvents?: unknown[] }).__closeEvents?.[0],
        ),
      )
      .toEqual({
        type: "close-calculator",
      });
  });

  test("falls back to portfolio URL when standalone", async ({ page }) => {
    await page.route("https://arek-portfolio-fbo.vercel.app/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Portfolio</title><h1>Portfolio</h1>",
      });
    });

    await gotoCalculator(page);
    await page.getByRole("button", { name: /Wróć do portfolio/i }).click();

    await expect(page).toHaveURL(
      "https://arek-portfolio-fbo.vercel.app/#kalkulator",
    );
  });

  test("keeps calculator inputs above results on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1200 });
    await gotoCalculator(page);

    const resultsBox = await page.locator(".workspace__results").boundingBox();
    const inputsBox = await page.locator(".workspace__inputs").boundingBox();

    expect(inputsBox?.y ?? 0).toBeLessThan(resultsBox?.y ?? 0);
  });

  test("keeps calculator inputs above results in narrow iframe mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 288, height: 1200 });
    await gotoCalculator(page);

    const resultsBox = await page.locator(".workspace__results").boundingBox();
    const inputsBox = await page.locator(".workspace__inputs").boundingBox();

    expect(inputsBox?.y ?? 0).toBeLessThan(resultsBox?.y ?? 0);
  });

  test("keeps calculator inputs above results on ipad portrait", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await gotoCalculator(page);

    const resultsBox = await page.locator(".workspace__results").boundingBox();
    const inputsBox = await page.locator(".workspace__inputs").boundingBox();

    expect(inputsBox?.y ?? 0).toBeLessThan(resultsBox?.y ?? 0);
  });

  test("matches first fold with floating dock on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page.locator("[data-mobile-result-dock]")).toBeVisible();
    await expect(page).toHaveScreenshot("mobile-floating-dock.png", {
      animations: "disabled",
    });
  });

  test("matches visual baseline for default state", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page).toHaveScreenshot("default-state.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("matches visual baseline after series change", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);
    await page.getByRole("tab", { name: /EDO/i }).click();

    await expect(page).toHaveScreenshot("series-change-edo.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("matches visual baseline for open compare section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page.locator(".compare-section")).toHaveScreenshot(
      "compare-section-open.png",
      {
        animations: "disabled",
      },
    );
  });

  test("matches visual baseline for mobile reorder", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1400 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page).toHaveScreenshot("mobile-reorder.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("matches visual baseline for narrow iframe mobile", async ({ page }) => {
    await page.setViewportSize({ width: 288, height: 1600 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page).toHaveScreenshot("mobile-iframe-narrow.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("matches visual baseline for ipad portrait", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoCalculator(page);

    await expect(page).toHaveScreenshot("ipad-portrait.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
