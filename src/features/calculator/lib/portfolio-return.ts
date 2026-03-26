export type PortfolioReturnResult =
  | "handled-in-page"
  | "posted-to-parent"
  | "redirected";

export function requestPortfolioReturn(
  button: HTMLButtonElement,
  fallbackUrl: string,
): PortfolioReturnResult {
  // This bridge is intentional: when the calculator is embedded, this CTA should
  // close the layer in place first and only fall back to navigation if nothing
  // handles the close intent locally.
  const closeIntent = new CustomEvent("fbo:close-calculator-layer", {
    bubbles: true,
    cancelable: true,
    detail: {
      source: "portfolio-cta",
      fallbackUrl,
    },
  });

  const handledInPage = !button.dispatchEvent(closeIntent);

  if (handledInPage) {
    return "handled-in-page";
  }

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: "fbo:close-calculator-layer",
        source: "portfolio-cta",
        fallbackUrl,
      },
      "*",
    );

    return "posted-to-parent";
  }

  window.location.href = fallbackUrl;
  return "redirected";
}

