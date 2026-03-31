import type { ComparisonScenarioState } from "@/features/comparison/domain/types";

export const COMPARISON_AMOUNT_PRESETS = [
  5_000,
  10_000,
  20_000,
  50_000,
  100_000,
];

export const COMPARISON_INFLATION_PRESETS = [2, 3.5, 5, 7];

export const COMPARISON_HORIZON_PRESETS = [4, 10, 20, 30];

export const DEFAULT_COMPARISON_STATE: ComparisonScenarioState = {
  amount: 10_000,
  horizonYears: 10,
  inflationMode: "preset",
  inflationPreset: 3.5,
  customInflation: 3.5,
  depositRate: 3,
  activeInstrumentIds: ["EDO", "COI", "TOS", "DEPOSIT"],
  displayMode: "net",
};
