import { describe, expect, it } from "vitest";
import { BONDS } from "@/features/calculator/domain/bonds";
import {
  BELKA_TAX_RATE,
  DEFAULT_CALCULATOR_STATE,
} from "@/features/calculator/lib/constants";
import {
  amountToSliderValue,
  calculateBenchmark,
  calculateBond,
  formatBondCount,
  getEffectiveInflation,
  normaliseAmount,
  parseAmountInput,
  parseLocaleNumber,
  sliderValueToAmount,
} from "@/features/calculator/lib/calculator";
import { formatGroupedInteger } from "@/features/calculator/lib/formatters";

describe("calculator logic", () => {
  it("normalises amount to full bonds and minimum 100 zł", () => {
    expect(normaliseAmount(1)).toBe(100);
    expect(normaliseAmount(149)).toBe(100);
    expect(normaliseAmount(151)).toBe(200);
  });

  it("parses locale decimals and falls back on invalid input", () => {
    expect(parseLocaleNumber("4,25", 0)).toBe(4.25);
    expect(parseLocaleNumber("4.25", 0)).toBe(4.25);
    expect(parseLocaleNumber("abc", 7.5)).toBe(7.5);
  });

  it("parses amount input from formatted strings", () => {
    expect(parseAmountInput("12 345", 0)).toBe(12_300);
    expect(parseAmountInput("", 5000)).toBe(5000);
  });

  it("maps slider values to amounts and back across all ranges", () => {
    const amounts = [100, 10_000, 100_000, 250_000, 500_000];

    amounts.forEach((amount) => {
      const sliderValue = amountToSliderValue(amount);
      expect(sliderValueToAmount(sliderValue)).toBeGreaterThanOrEqual(100);
      expect(Math.abs(sliderValueToAmount(sliderValue) - amount)).toBeLessThanOrEqual(
        100,
      );
    });
  });

  it("returns preset or custom inflation depending on mode", () => {
    expect(getEffectiveInflation(DEFAULT_CALCULATOR_STATE)).toBe(3.5);
    expect(
      getEffectiveInflation({
        ...DEFAULT_CALCULATOR_STATE,
        inflationMode: "custom",
        customInflation: 4.2,
      }),
    ).toBe(4.2);
  });

  it("formats bond count with Polish pluralisation", () => {
    expect(formatBondCount(1)).toBe("1 obligacja po 100 zł");
    expect(formatBondCount(2)).toBe("2 obligacje po 100 zł");
    expect(formatBondCount(5)).toBe("5 obligacji po 100 zł");
  });

  it("forces grouped thousands in amount presets", () => {
    expect(formatGroupedInteger(3000)).toBe("3 000");
    expect(formatGroupedInteger(5000)).toBe("5 000");
    expect(formatGroupedInteger(50_000)).toBe("50 000");
  });

  it("matches prototype math for default COI scenario", () => {
    const result = calculateBond(
      BONDS.COI,
      10_000,
      3.5,
      DEFAULT_CALCULATOR_STATE.nbpRate,
      false,
    );

    expect(result.totalInterest).toBeCloseTo(2000, 6);
    expect(result.tax).toBeCloseTo(380, 6);
    expect(result.netProfit).toBeCloseTo(1620, 6);
    expect(result.netReturn).toBeCloseTo(11_620, 6);
    expect(result.effectiveAnnualRate).toBeCloseTo(3.8249, 3);
    expect(result.breakdown).toHaveLength(4);
  });

  it("removes Belka tax for bonds when IKE is enabled", () => {
    const withoutIke = calculateBond(
      BONDS.COI,
      10_000,
      3.5,
      DEFAULT_CALCULATOR_STATE.nbpRate,
      false,
    );
    const withIke = calculateBond(
      BONDS.COI,
      10_000,
      3.5,
      DEFAULT_CALCULATOR_STATE.nbpRate,
      true,
    );

    expect(withIke.tax).toBe(0);
    expect(withIke.netProfit).toBeCloseTo(withoutIke.totalInterest, 6);
    expect(withIke.netProfit - withoutIke.netProfit).toBeCloseTo(
      withoutIke.totalInterest * BELKA_TAX_RATE,
      6,
    );
  });

  it("changes ROR result when NBP rate changes", () => {
    const lowNbp = calculateBond(BONDS.ROR, 10_000, 3.5, 2, false);
    const highNbp = calculateBond(BONDS.ROR, 10_000, 3.5, 6, false);

    expect(highNbp.netProfit).toBeGreaterThan(lowNbp.netProfit);
    expect(highNbp.breakdown[0]?.rateLabel).toContain("6,00%");
  });

  it("changes inflation-indexed bonds when inflation changes", () => {
    const lowInflation = calculateBond(BONDS.EDO, 10_000, 2, 3.75, false);
    const highInflation = calculateBond(BONDS.EDO, 10_000, 5, 3.75, false);

    expect(highInflation.netProfit).toBeGreaterThan(lowInflation.netProfit);
  });

  it("keeps fixed-rate TOS nominal result independent from inflation", () => {
    const lowInflation = calculateBond(BONDS.TOS, 10_000, 2, 3.75, false);
    const highInflation = calculateBond(BONDS.TOS, 10_000, 5, 3.75, false);

    expect(highInflation.netProfit).toBeCloseTo(lowInflation.netProfit, 6);
    expect(highInflation.realReturn).toBeLessThan(lowInflation.realReturn);
  });

  it("calculates short benchmark periods like the prototype", () => {
    const result = calculateBenchmark(10_000, 4, 3, 3.5);

    expect(result.totalInterest).toBeCloseTo(100, 6);
    expect(result.tax).toBeCloseTo(19, 6);
    expect(result.netProfit).toBeCloseTo(81, 6);
    expect(result.breakdown).toHaveLength(1);
  });

  it("calculates annual benchmark compounding for longer horizons", () => {
    const result = calculateBenchmark(10_000, 4, 12, 3.5);

    expect(result.totalInterest).toBeCloseTo(400, 6);
    expect(result.tax).toBeCloseTo(76, 6);
    expect(result.netProfit).toBeCloseTo(324, 6);
    expect(result.netReturn).toBeCloseTo(10_324, 6);
  });

  it("returns a coherent breakdown for every bond series", () => {
    Object.values(BONDS).forEach((bond) => {
      const result = calculateBond(
        bond,
        DEFAULT_CALCULATOR_STATE.amount,
        DEFAULT_CALCULATOR_STATE.inflationPreset,
        DEFAULT_CALCULATOR_STATE.nbpRate,
        DEFAULT_CALCULATOR_STATE.ike,
      );

      const expectedBreakdownLength =
        bond.id === "OTS" ? 1 : bond.termMonths / 12;

      expect(result.breakdown).toHaveLength(expectedBreakdownLength);
      expect(result.termLabel).toBe(bond.termLabel);
      expect(result.netReturn).toBeGreaterThan(0);
    });
  });
});
