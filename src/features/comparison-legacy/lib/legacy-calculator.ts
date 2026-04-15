export const BELKA_TAX_RATE = 0.19;
export const MIN_AMOUNT = 100;
export const SLIDER_AMOUNT_MAX = 500_000;
export const SLIDER_MAX = 1000;
export const SLIDER_FINE_BREAK = 600;
export const SLIDER_MID_BREAK = 850;
export const FINE_RANGE_MAX = 100_000;
export const MID_RANGE_MAX = 250_000;

export function parseLocaleNumber(value: string, fallback: number) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normaliseAmount(value: number) {
  const safeValue = Math.max(MIN_AMOUNT, value);

  return Math.round(safeValue / 100) * 100;
}

export function amountToSliderValue(amount: number) {
  const safeAmount = Math.min(normaliseAmount(amount), SLIDER_AMOUNT_MAX);

  if (safeAmount <= FINE_RANGE_MAX) {
    return Math.round(
      ((safeAmount - MIN_AMOUNT) / (FINE_RANGE_MAX - MIN_AMOUNT)) *
        SLIDER_FINE_BREAK,
    );
  }

  if (safeAmount <= MID_RANGE_MAX) {
    return Math.round(
      SLIDER_FINE_BREAK +
        ((safeAmount - FINE_RANGE_MAX) / (MID_RANGE_MAX - FINE_RANGE_MAX)) *
          (SLIDER_MID_BREAK - SLIDER_FINE_BREAK),
    );
  }

  return Math.round(
    SLIDER_MID_BREAK +
      ((safeAmount - MID_RANGE_MAX) / (SLIDER_AMOUNT_MAX - MID_RANGE_MAX)) *
        (SLIDER_MAX - SLIDER_MID_BREAK),
  );
}

export function sliderValueToAmount(sliderValue: number) {
  const safeValue = Math.max(0, Math.min(SLIDER_MAX, sliderValue));

  if (safeValue <= SLIDER_FINE_BREAK) {
    const ratio = safeValue / SLIDER_FINE_BREAK;

    return normaliseAmount(MIN_AMOUNT + ratio * (FINE_RANGE_MAX - MIN_AMOUNT));
  }

  if (safeValue <= SLIDER_MID_BREAK) {
    const ratio =
      (safeValue - SLIDER_FINE_BREAK) / (SLIDER_MID_BREAK - SLIDER_FINE_BREAK);

    return normaliseAmount(
      FINE_RANGE_MAX + ratio * (MID_RANGE_MAX - FINE_RANGE_MAX),
    );
  }

  const ratio =
    (safeValue - SLIDER_MID_BREAK) / (SLIDER_MAX - SLIDER_MID_BREAK);

  return normaliseAmount(
    MID_RANGE_MAX + ratio * (SLIDER_AMOUNT_MAX - MID_RANGE_MAX),
  );
}

export function inflationFactor(inflation: number, years: number) {
  return Math.pow(1 + inflation / 100, years);
}
