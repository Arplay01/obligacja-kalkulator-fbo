import type { BondId, CalculatorState } from "@/features/calculator/domain/types";
import { CURRENT_NBP_REFERENCE_RATE } from "@/features/calculator/lib/current-bond-offer";

export const BELKA_TAX_RATE = 0.19;
export const DEFAULT_NBP_RATE = CURRENT_NBP_REFERENCE_RATE;
export const MIN_AMOUNT = 100;
export const SLIDER_AMOUNT_MAX = 500_000;
export const SLIDER_MAX = 1000;
export const SLIDER_FINE_BREAK = 600;
export const SLIDER_MID_BREAK = 850;
export const FINE_RANGE_MAX = 100_000;
export const MID_RANGE_MAX = 250_000;
export const DEFAULT_INFLATION_RATE = 2.7;
export const CALCULATOR_INFLATION_PRESETS = [DEFAULT_INFLATION_RATE, 3.5, 5] as const;

export const BOND_ORDER: BondId[] = ["OTS", "ROR", "DOR", "TOS", "COI", "EDO"];

export const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  bondId: "COI",
  amount: 10_000,
  inflationMode: "preset",
  inflationPreset: DEFAULT_INFLATION_RATE,
  customInflation: DEFAULT_INFLATION_RATE,
  depositRate: 4,
  savingsRate: 3.75,
  nbpRate: DEFAULT_NBP_RATE,
  ike: false,
};

export const PORTFOLIO_FALLBACK_URL =
  "https://arek-portfolio-fbo.vercel.app/#kalkulator";

export const EXTERNAL_LINKS = {
  depositRanking:
    "https://marciniwuc.com/ranking-lokat-sprawdz-najlepsze-lokaty-bankowe/",
  savingsRanking: "https://marciniwuc.com/ranking-kont-oszczednosciowych/",
  challenge: "https://marciniwuc.com/wyzwanie-pierwsza-obligacja/",
  education:
    "https://marciniwuc.com/obligacje-indeksowane-inflacja-kalkulator/",
  familyBonds: "https://marciniwuc.com/rodzinne-obligacje-skarbowe/",
  excel:
    "https://marciniwuc.com/wp-content/uploads/2026/02/Kalkulator-obligacji-marzec-2026-Finanse-Bardzo-Osobiste.xlsx",
};
