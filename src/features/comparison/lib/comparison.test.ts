import { describe, expect, it } from "vitest";
import {
  countDecisionCost,
  simulateComparisonScenario,
} from "@/features/comparison/lib/comparison";
import { DEFAULT_COMPARISON_STATE } from "@/features/comparison/lib/constants";

describe("comparison simulation", () => {
  it("counts decision cost per instrument as planned", () => {
    expect(countDecisionCost("EDO", 30)).toBe(3);
    expect(countDecisionCost("COI", 30)).toBe(8);
    expect(countDecisionCost("TOS", 30)).toBe(10);
    expect(countDecisionCost("DEPOSIT", 30)).toBe(60);
  });

  it("builds a coherent default scenario with all yearly points", () => {
    const result = simulateComparisonScenario(DEFAULT_COMPARISON_STATE);

    expect(result.amount).toBe(10_000);
    expect(result.chartRows).toHaveLength(11);
    expect(result.baseline.series).toHaveLength(11);
    expect(result.allResults).toHaveLength(4);
    expect(result.activeResults).toHaveLength(4);
    expect(result.chartRows[0]?.label).toBe("Start");
    expect(result.chartRows.at(-1)?.label).toBe("10 rok");
  });

  it("keeps EDO ahead of COI and lokata in the default 10-year scenario", () => {
    const result = simulateComparisonScenario(DEFAULT_COMPARISON_STATE);
    const edo = result.allResults.find((item) => item.id === "EDO");
    const coi = result.allResults.find((item) => item.id === "COI");
    const deposit = result.allResults.find((item) => item.id === "DEPOSIT");

    expect(edo?.finalNet ?? 0).toBeGreaterThan(coi?.finalNet ?? 0);
    expect(coi?.finalNet ?? 0).toBeGreaterThan(deposit?.finalNet ?? 0);
    expect(edo?.decisions).toBeLessThan(coi?.decisions ?? 0);
    expect(coi?.decisions).toBeLessThan(deposit?.decisions ?? 0);
  });

  it("rolls over capitalized instruments and exposes renewal markers", () => {
    const result = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      horizonYears: 20,
      activeInstrumentIds: ["EDO", "TOS", "DEPOSIT"],
    });
    const edo = result.allResults.find((item) => item.id === "EDO");
    const tos = result.allResults.find((item) => item.id === "TOS");

    expect(edo?.markers.map((marker) => marker.year)).toEqual([10]);
    expect(tos?.markers.map((marker) => marker.year)).toEqual([3, 6, 9, 12, 15, 18]);
    expect(edo?.series).toHaveLength(21);
    expect(tos?.series).toHaveLength(21);
  });

  it("shows yearly lokata renewals and decision growth", () => {
    const result = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      horizonYears: 4,
      activeInstrumentIds: ["DEPOSIT"],
    });
    const deposit = result.allResults.find((item) => item.id === "DEPOSIT");

    expect(deposit?.markers.map((marker) => marker.year)).toEqual([1, 2, 3]);
    expect(deposit?.series[1]?.decisions).toBe(2);
    expect(deposit?.series[4]?.decisions).toBe(8);
  });

  it("treats COI payouts as non-reinvested cash and still rolls only principal", () => {
    const result = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      horizonYears: 8,
      activeInstrumentIds: ["COI"],
    });
    const coi = result.allResults.find((item) => item.id === "COI");

    expect(coi?.markers.map((marker) => marker.year)).toEqual([4]);
    expect(coi?.series[4]?.netValue ?? 0).toBeGreaterThan(10_000);
    expect(coi?.series[8]?.netValue ?? 0).toBeGreaterThan(coi?.series[4]?.netValue ?? 0);
  });

  it("applies early redemption costs before maturity for capitalized bonds", () => {
    const oneYear = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      horizonYears: 1,
      activeInstrumentIds: ["EDO", "TOS"],
    });
    const edo = oneYear.allResults.find((item) => item.id === "EDO");
    const tos = oneYear.allResults.find((item) => item.id === "TOS");

    expect(edo?.finalNet ?? 0).toBeLessThan(10_560);
    expect(edo?.finalNet ?? 0).toBeGreaterThan(10_000);
    expect(tos?.finalNet ?? 0).toBeLessThan(10_465);
    expect(tos?.finalNet ?? 0).toBeGreaterThan(10_000);
  });

  it("switches effort ranking when display mode changes", () => {
    const netScenario = simulateComparisonScenario(DEFAULT_COMPARISON_STATE);
    const realScenario = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      displayMode: "real",
    });

    expect(netScenario.effortRows[0]?.id).toBe("EDO");
    expect(realScenario.effortRows[0]?.id).toBe("EDO");
    expect(realScenario.allResults.every((result) => Number.isFinite(result.finalReal))).toBe(
      true,
    );
  });

  it("keeps chart rows free from NaN values", () => {
    const result = simulateComparisonScenario({
      ...DEFAULT_COMPARISON_STATE,
      amount: 99_950,
      horizonYears: 30,
      customInflation: 7,
      inflationMode: "custom",
      activeInstrumentIds: ["EDO", "COI", "TOS", "DEPOSIT"],
    });

    result.chartRows.forEach((row) => {
      expect(Number.isFinite(row.EDO_net)).toBe(true);
      expect(Number.isFinite(row.EDO_real)).toBe(true);
      expect(Number.isFinite(row.COI_net)).toBe(true);
      expect(Number.isFinite(row.TOS_real)).toBe(true);
      expect(Number.isFinite(row.DEPOSIT_net)).toBe(true);
      expect(Number.isFinite(row.INACTION_real)).toBe(true);
    });
  });
});
