import type { ComparisonScenarioState } from "@/features/comparison/domain/types";
import { DEFAULT_INFLATION_RATE } from "@/features/calculator/lib/constants";

export const COMPARISON_AMOUNT_PRESETS = [
  5_000,
  10_000,
  20_000,
  50_000,
  100_000,
];

export const COMPARISON_INFLATION_PRESETS = [DEFAULT_INFLATION_RATE, 3.5, 5, 7];

export const DEFAULT_COMPARISON_STATE: ComparisonScenarioState = {
  amount: 10_000,
  horizonYears: 10,
  inflationMode: "preset",
  inflationPreset: DEFAULT_INFLATION_RATE,
  customInflation: DEFAULT_INFLATION_RATE,
  depositRate: 3,
  activeInstrumentIds: ["EDO", "COI"],
  displayMode: "net",
};
