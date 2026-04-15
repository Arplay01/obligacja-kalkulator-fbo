import {
  BASELINE_COMPARISON_COLOR,
  COMPARISON_INSTRUMENT_ORDER,
  COMPARISON_INSTRUMENTS,
} from "@/features/comparison-legacy/domain/instruments";
import type {
  ComparisonBaselineResult,
  ComparisonChartRow,
  ComparisonEffortRow,
  ComparisonInstrumentDefinition,
  ComparisonInstrumentId,
  ComparisonInsight,
  ComparisonInstrumentResult,
  ComparisonRecommendation,
  ComparisonScenarioResult,
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
  ComparisonSeriesPoint,
  ComparisonSmartSuggestion,
  ComparisonValueMode,
} from "@/features/comparison-legacy/domain/types";
import {
  BELKA_TAX_RATE,
  inflationFactor,
  normaliseAmount,
} from "@/features/comparison-legacy/lib/legacy-calculator";
import { formatMoneyRounded } from "@/features/calculator/lib/formatters";

const BOND_DENOMINATION = 100;

function floorToBondAmount(value: number) {
  return Math.max(0, Math.floor(value / BOND_DENOMINATION) * BOND_DENOMINATION);
}

function createSeriesPoint(
  year: number,
  netValue: number,
  effectiveInflation: number,
  decisions: number,
  hasDecisionMarker: boolean,
  markerLabel: string | null,
  earlyExit: {
    isEarlyExit: boolean;
    earlyExitFee: number;
    preExitNetValue: number;
  } = { isEarlyExit: false, earlyExitFee: 0, preExitNetValue: netValue },
): ComparisonSeriesPoint {
  const realValue = netValue / inflationFactor(effectiveInflation, year);
  const preExitRealValue =
    earlyExit.preExitNetValue / inflationFactor(effectiveInflation, year);

  return {
    year,
    label: year === 0 ? "Start" : `Rok ${year}`,
    netValue,
    realValue,
    decisions,
    hasDecisionMarker,
    markerLabel,
    isEarlyExit: earlyExit.isEarlyExit,
    earlyExitFee: earlyExit.earlyExitFee,
    preExitNetValue: earlyExit.preExitNetValue,
    preExitRealValue,
  };
}

function getPointLabel(year: number) {
  return year === 0 ? "Start" : `${year} rok`;
}

function getEffectiveInflation(state: ComparisonScenarioState) {
  return state.inflationMode === "custom"
    ? state.customInflation
    : state.inflationPreset;
}

export function countDecisionCost(
  instrumentId: ComparisonSelectableInstrumentId,
  horizonYears: number,
) {
  const definition = COMPARISON_INSTRUMENTS[instrumentId];

  if (definition.decisionModel.mode === "cycle") {
    return Math.ceil(horizonYears / definition.decisionModel.cycleYears);
  }

  return horizonYears * definition.decisionModel.decisionsPerYear;
}

function countDecisionCostToYear(
  instrumentId: ComparisonSelectableInstrumentId,
  year: number,
) {
  if (year === 0) {
    return 0;
  }

  return countDecisionCost(instrumentId, year);
}

function getAnnualRate(
  definition: ComparisonInstrumentDefinition,
  cycleYear: number,
  effectiveInflation: number,
  depositRate: number,
) {
  if (definition.kind === "deposit") {
    return depositRate;
  }

  if (definition.kind === "fixed_capitalized") {
    return definition.firstRate;
  }

  if (cycleYear === 1) {
    return definition.firstRate;
  }

  return Math.max(0, effectiveInflation + definition.margin);
}

function buildMarkerLabel(definition: ComparisonInstrumentDefinition) {
  if (definition.id === "DEPOSIT") {
    return "Odnowienie lokaty";
  }

  return `Nowa decyzja: ${definition.shortLabel}`;
}

function simulateCapitalizedInstrument(
  definition: ComparisonInstrumentDefinition,
  amount: number,
  horizonYears: number,
  effectiveInflation: number,
): ComparisonInstrumentResult {
  const series: ComparisonSeriesPoint[] = [
    createSeriesPoint(0, amount, effectiveInflation, 0, false, null),
  ];
  const markers = [];
  let idleCash = 0;
  let cycleYear = 0;
  let cyclePrincipal = amount;
  let cycleGrossBalance = amount;

  for (let year = 1; year <= horizonYears; year += 1) {
    cycleYear += 1;

    const rate = getAnnualRate(definition, cycleYear, effectiveInflation, 0);
    cycleGrossBalance += cycleGrossBalance * (rate / 100);

    const isMaturityYear = cycleYear === definition.termYears;
    let netBondValue = cycleGrossBalance;
    let hasDecisionMarker = false;
    let markerLabel: string | null = null;
    let earlyExitFeeAmount = 0;
    let preExitNetValue = 0;

    if (isMaturityYear) {
      const grossInterest = Math.max(cycleGrossBalance - cyclePrincipal, 0);
      const tax = grossInterest * BELKA_TAX_RATE;
      netBondValue = cycleGrossBalance - tax;

      if (year < horizonYears) {
        const reinvestedPrincipal = floorToBondAmount(netBondValue);
        idleCash += netBondValue - reinvestedPrincipal;
        cyclePrincipal = reinvestedPrincipal;
        cycleGrossBalance = reinvestedPrincipal;
        cycleYear = 0;
        hasDecisionMarker = reinvestedPrincipal >= BOND_DENOMINATION;
        markerLabel = hasDecisionMarker ? buildMarkerLabel(definition) : null;

        if (markerLabel) {
          markers.push({
            year,
            label: markerLabel,
          });
        }
      }
    } else {
      const bondCount = Math.floor(cyclePrincipal / BOND_DENOMINATION);
      const accruedInterest = Math.max(cycleGrossBalance - cyclePrincipal, 0);
      const fee = Math.min(bondCount * definition.feePerBond, accruedInterest);
      const taxableBase = Math.max(accruedInterest - fee, 0);
      const tax = taxableBase * BELKA_TAX_RATE;
      netBondValue = cycleGrossBalance - fee - tax;

      if (year === horizonYears) {
        earlyExitFeeAmount = fee;
        /* preExitNetValue: value without early exit fee deduction */
        const taxWithoutFee = accruedInterest * BELKA_TAX_RATE;
        preExitNetValue = idleCash + (cycleGrossBalance - taxWithoutFee);
      }
    }

    const totalNetValue = idleCash + netBondValue;
    const isEarlyExit =
      year === horizonYears && cycleYear !== definition.termYears;

    series.push(
      createSeriesPoint(
        year,
        totalNetValue,
        effectiveInflation,
        countDecisionCostToYear(definition.id, year),
        hasDecisionMarker,
        markerLabel,
        {
          isEarlyExit,
          earlyExitFee: earlyExitFeeAmount,
          preExitNetValue: isEarlyExit ? preExitNetValue : totalNetValue,
        },
      ),
    );
  }

  const finalPoint = series.at(-1) ?? series[0];

  return {
    id: definition.id,
    label: definition.label,
    shortLabel: definition.shortLabel,
    summary: definition.summary,
    color: definition.color,
    fillColor: definition.fillColor,
    finalNet: finalPoint.netValue,
    finalReal: finalPoint.realValue,
    netProfit: finalPoint.netValue - amount,
    realProfit: finalPoint.realValue - amount,
    decisions: countDecisionCost(definition.id, horizonYears),
    markers,
    series,
  };
}

function simulateCouponInstrument(
  definition: ComparisonInstrumentDefinition,
  amount: number,
  horizonYears: number,
  effectiveInflation: number,
): ComparisonInstrumentResult {
  const series: ComparisonSeriesPoint[] = [
    createSeriesPoint(0, amount, effectiveInflation, 0, false, null),
  ];
  const markers = [];
  const bondCount = Math.floor(amount / BOND_DENOMINATION);
  const maxEarlyExitFee = bondCount * definition.feePerBond;
  let couponsCash = 0;
  let cycleYear = 0;

  for (let year = 1; year <= horizonYears; year += 1) {
    cycleYear += 1;
    const rate = getAnnualRate(definition, cycleYear, effectiveInflation, 0);
    const grossCoupon = amount * (rate / 100);
    const netCoupon = grossCoupon * (1 - BELKA_TAX_RATE);
    couponsCash += netCoupon;

    const isMaturityYear = cycleYear === definition.termYears;
    /* COI fee cap: fee cannot exceed accrued gross interest in current year */
    const cappedFee = isMaturityYear
      ? 0
      : Math.min(maxEarlyExitFee, Math.max(grossCoupon, 0));
    const totalNetValue = isMaturityYear
      ? amount + couponsCash
      : amount - cappedFee + couponsCash;
    const hasDecisionMarker = isMaturityYear && year < horizonYears;
    const markerLabel = hasDecisionMarker ? buildMarkerLabel(definition) : null;

    if (hasDecisionMarker && markerLabel) {
      markers.push({
        year,
        label: markerLabel,
      });
      cycleYear = 0;
    }

    const isEarlyExit = year === horizonYears && !isMaturityYear;

    series.push(
      createSeriesPoint(
        year,
        totalNetValue,
        effectiveInflation,
        countDecisionCostToYear(definition.id, year),
        hasDecisionMarker,
        markerLabel,
        {
          isEarlyExit,
          earlyExitFee: isEarlyExit ? cappedFee : 0,
          preExitNetValue: isEarlyExit
            ? amount + couponsCash
            : totalNetValue,
        },
      ),
    );
  }

  const finalPoint = series.at(-1) ?? series[0];

  return {
    id: definition.id,
    label: definition.label,
    shortLabel: definition.shortLabel,
    summary: definition.summary,
    color: definition.color,
    fillColor: definition.fillColor,
    finalNet: finalPoint.netValue,
    finalReal: finalPoint.realValue,
    netProfit: finalPoint.netValue - amount,
    realProfit: finalPoint.realValue - amount,
    decisions: countDecisionCost(definition.id, horizonYears),
    markers,
    series,
  };
}

function simulateDepositInstrument(
  definition: ComparisonInstrumentDefinition,
  amount: number,
  horizonYears: number,
  effectiveInflation: number,
  depositRate: number,
): ComparisonInstrumentResult {
  const series: ComparisonSeriesPoint[] = [
    createSeriesPoint(0, amount, effectiveInflation, 0, false, null),
  ];
  const markers = [];
  let balance = amount;

  for (let year = 1; year <= horizonYears; year += 1) {
    const netRate = depositRate * (1 - BELKA_TAX_RATE);
    balance += balance * (netRate / 100);

    const hasDecisionMarker = year < horizonYears;
    const markerLabel = hasDecisionMarker ? buildMarkerLabel(definition) : null;

    if (hasDecisionMarker && markerLabel) {
      markers.push({
        year,
        label: markerLabel,
      });
    }

    series.push(
      createSeriesPoint(
        year,
        balance,
        effectiveInflation,
        countDecisionCostToYear(definition.id, year),
        hasDecisionMarker,
        markerLabel,
      ),
    );
  }

  const finalPoint = series.at(-1) ?? series[0];

  return {
    id: definition.id,
    label: definition.label,
    shortLabel: definition.shortLabel,
    summary: definition.summary,
    color: definition.color,
    fillColor: definition.fillColor,
    finalNet: finalPoint.netValue,
    finalReal: finalPoint.realValue,
    netProfit: finalPoint.netValue - amount,
    realProfit: finalPoint.realValue - amount,
    decisions: countDecisionCost(definition.id, horizonYears),
    markers,
    series,
  };
}

function simulateBaseline(
  amount: number,
  horizonYears: number,
  effectiveInflation: number,
): ComparisonBaselineResult {
  const series = Array.from({ length: horizonYears + 1 }, (_, index) =>
    createSeriesPoint(index, amount, effectiveInflation, 0, false, null),
  );
  const finalPoint = series.at(-1) ?? series[0];

  return {
    id: "INACTION",
    label: "Nic nie robisz",
    shortLabel: "Bez ruchu",
    color: BASELINE_COMPARISON_COLOR,
    finalNet: finalPoint.netValue,
    finalReal: finalPoint.realValue,
    series,
  };
}

function buildChartRows(
  baseline: ComparisonBaselineResult,
  results: ComparisonInstrumentResult[],
) {
  return baseline.series.map((baselinePoint, index) => {
    const instrumentPointMap = Object.fromEntries(
      results.map((result) => [result.id, result.series[index] ?? result.series[0]]),
    ) as Record<ComparisonSelectableInstrumentId, ComparisonSeriesPoint>;

    return {
      year: baselinePoint.year,
      label: getPointLabel(baselinePoint.year),
      EDO_net: instrumentPointMap.EDO.netValue,
      EDO_real: instrumentPointMap.EDO.realValue,
      EDO_preExitNet: instrumentPointMap.EDO.preExitNetValue,
      EDO_preExitReal: instrumentPointMap.EDO.preExitRealValue,
      COI_net: instrumentPointMap.COI.netValue,
      COI_real: instrumentPointMap.COI.realValue,
      COI_preExitNet: instrumentPointMap.COI.preExitNetValue,
      COI_preExitReal: instrumentPointMap.COI.preExitRealValue,
      TOS_net: instrumentPointMap.TOS.netValue,
      TOS_real: instrumentPointMap.TOS.realValue,
      TOS_preExitNet: instrumentPointMap.TOS.preExitNetValue,
      TOS_preExitReal: instrumentPointMap.TOS.preExitRealValue,
      DEPOSIT_net: instrumentPointMap.DEPOSIT.netValue,
      DEPOSIT_real: instrumentPointMap.DEPOSIT.realValue,
      DEPOSIT_preExitNet: instrumentPointMap.DEPOSIT.preExitNetValue,
      DEPOSIT_preExitReal: instrumentPointMap.DEPOSIT.preExitRealValue,
      INACTION_net: baselinePoint.netValue,
      INACTION_real: baselinePoint.realValue,
      details: {
        EDO: instrumentPointMap.EDO,
        COI: instrumentPointMap.COI,
        TOS: instrumentPointMap.TOS,
        DEPOSIT: instrumentPointMap.DEPOSIT,
        INACTION: baselinePoint,
      },
    } satisfies ComparisonChartRow;
  });
}

export function formatYearsPolish(years: number): string {
  if (years === 1) return "rok";
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "lata";
  return "lat";
}

function getEarlyExitYearsBefore(
  definition: ComparisonInstrumentDefinition,
  horizonYears: number,
): number {
  const cyclesCompleted = Math.floor(horizonYears / definition.termYears);
  const remainingYears =
    horizonYears - cyclesCompleted * definition.termYears;

  if (remainingYears === 0) return 0;

  return definition.termYears - remainingYears;
}

function buildSubheadline(
  definition: ComparisonInstrumentDefinition,
): string {
  switch (definition.id) {
    case "TOS":
      return `Obligacje ${definition.termYears}-letnie ze stałym oprocentowaniem ${definition.firstRate}%`;
    case "EDO":
      return `Obligacje ${definition.termYears}-letnie indeksowane inflacją z kapitalizacją`;
    case "COI":
      return `Obligacje ${definition.termYears}-letnie indeksowane inflacją`;
    case "DEPOSIT":
      return "Lokata bankowa";
  }
}

function buildRecommendationBody(
  result: ComparisonInstrumentResult,
  definition: ComparisonInstrumentDefinition,
  amount: number,
  isTermAligned: boolean,
  earlyExitFee: number,
  earlyExitYearsBefore: number,
): string {
  let body = `Twoje ${formatMoneyRounded(amount)} urośnie do ok. ${formatMoneyRounded(result.finalNet)} netto.`;

  if (isTermAligned) {
    body +=
      " Termin obligacji pokrywa się z Twoim horyzontem - zero opłat za wcześniejsze wyjście.";
  } else if (earlyExitYearsBefore > 0 && definition.id !== "DEPOSIT") {
    body += ` Uwaga: ${definition.label} to obligacja ${definition.termYears}-letnia - wyjście ${earlyExitYearsBefore} ${formatYearsPolish(earlyExitYearsBefore)} przed terminem kosztuje ${formatMoneyRounded(earlyExitFee)} opłaty.`;
  }

  switch (definition.id) {
    case "COI":
      body +=
        " Pamiętaj: odsetki trafiają na Twoje konto co rok i nie pracują dalej.";
      break;
    case "EDO":
      body +=
        " Odsetki kapitalizują się - pracują na Ciebie przez cały okres.";
      break;
    case "TOS":
      body +=
        " Stałe oprocentowanie - wiesz dokładnie ile dostaniesz.";
      break;
  }

  return body;
}

function buildRecommendation(
  activeResults: ComparisonInstrumentResult[],
  amount: number,
  horizonYears: number,
): ComparisonRecommendation {
  const bestActive = [...activeResults].sort(
    (a, b) => b.finalNet - a.finalNet,
  )[0];
  const definition = COMPARISON_INSTRUMENTS[bestActive.id];

  const isTermAligned =
    horizonYears >= definition.termYears &&
    horizonYears % definition.termYears === 0;

  const earlyExitYearsBefore = getEarlyExitYearsBefore(
    definition,
    horizonYears,
  );

  const bondCount = Math.floor(amount / BOND_DENOMINATION);
  const earlyExitFee =
    earlyExitYearsBefore > 0 ? bondCount * definition.feePerBond : 0;

  const headline = `Na ${horizonYears} ${formatYearsPolish(horizonYears)} najlepszym wyborem jest ${definition.shortLabel}`;
  const subheadline = buildSubheadline(definition);
  const body = buildRecommendationBody(
    bestActive,
    definition,
    amount,
    isTermAligned,
    earlyExitFee,
    earlyExitYearsBefore,
  );

  return {
    bestId: bestActive.id,
    bestLabel: definition.label,
    bestFinalNet: bestActive.finalNet,
    bestProfit: bestActive.netProfit,
    isTermAligned,
    earlyExitFee,
    earlyExitYearsBefore,
    headline,
    subheadline,
    body,
  };
}

function buildSmartSuggestion(
  allResults: ComparisonInstrumentResult[],
  activeResults: ComparisonInstrumentResult[],
  activeInstrumentIds: ComparisonSelectableInstrumentId[],
): ComparisonSmartSuggestion {
  const bestActive = [...activeResults].sort(
    (a, b) => b.finalNet - a.finalNet,
  )[0];

  const disabledResults = allResults.filter(
    (r) => !activeInstrumentIds.includes(r.id),
  );
  const betterDisabled = disabledResults
    .filter((r) => r.finalNet > bestActive.finalNet)
    .sort((a, b) => b.finalNet - a.finalNet);

  if (betterDisabled.length === 0) return null;

  const best = betterDisabled[0];

  return {
    instrumentId: best.id,
    label: COMPARISON_INSTRUMENTS[best.id].label,
    delta: best.finalNet - bestActive.finalNet,
    finalNet: best.finalNet,
  };
}

export function getDisplayedValue(
  result: Pick<ComparisonInstrumentResult, "finalNet" | "finalReal">,
  displayMode: ComparisonValueMode,
) {
  return displayMode === "real" ? result.finalReal : result.finalNet;
}

export function getDisplayedProfit(
  result: Pick<ComparisonInstrumentResult, "netProfit" | "realProfit">,
  displayMode: ComparisonValueMode,
) {
  return displayMode === "real" ? result.realProfit : result.netProfit;
}

export function simulateComparisonScenario(
  state: ComparisonScenarioState,
): ComparisonScenarioResult {
  const amount = normaliseAmount(state.amount);
  const effectiveInflation = getEffectiveInflation(state);
  const baseline = simulateBaseline(amount, state.horizonYears, effectiveInflation);
  const allResults = COMPARISON_INSTRUMENT_ORDER.map((instrumentId) => {
    const definition = COMPARISON_INSTRUMENTS[instrumentId];

    if (definition.kind === "deposit") {
      return simulateDepositInstrument(
        definition,
        amount,
        state.horizonYears,
        effectiveInflation,
        state.depositRate,
      );
    }

    if (definition.kind === "inflation_payout") {
      return simulateCouponInstrument(
        definition,
        amount,
        state.horizonYears,
        effectiveInflation,
      );
    }

    return simulateCapitalizedInstrument(
      definition,
      amount,
      state.horizonYears,
      effectiveInflation,
    );
  });

  const activeResults = allResults.filter((result) =>
    state.activeInstrumentIds.includes(result.id),
  );
  const bestResult =
    activeResults.length === 0
      ? null
      : activeResults.reduce((best, current) =>
          getDisplayedValue(current, state.displayMode) >
          getDisplayedValue(best, state.displayMode)
            ? current
            : best,
        );
  const effortRows = [...activeResults]
    .sort(
      (left, right) =>
        getDisplayedValue(right, state.displayMode) -
        getDisplayedValue(left, state.displayMode),
    )
    .map((result) => {
      const lastPoint = result.series[result.series.length - 1];

      return {
        id: result.id,
        label: result.label,
        color: result.color,
        finalValue: getDisplayedValue(result, state.displayMode),
        profit: getDisplayedProfit(result, state.displayMode),
        decisions: result.decisions,
        isBest: result.id === bestResult?.id,
        hasEarlyExit: lastPoint?.isEarlyExit ?? false,
        earlyExitFee: lastPoint?.earlyExitFee ?? 0,
      };
    }) satisfies ComparisonEffortRow[];
  const activeIds = new Set(state.activeInstrumentIds);
  const edoResult = allResults.find((result) => result.id === "EDO");
  const coiResult = allResults.find((result) => result.id === "COI");
  const insight: ComparisonInsight | null =
    activeIds.has("EDO") && activeIds.has("COI") && edoResult && coiResult
      ? {
          winnerId:
            getDisplayedValue(edoResult, state.displayMode) >=
            getDisplayedValue(coiResult, state.displayMode)
              ? ("EDO" as const)
              : ("COI" as const),
          deltaNet: edoResult.finalNet - coiResult.finalNet,
          deltaReal: edoResult.finalReal - coiResult.finalReal,
        }
      : null;

  const recommendation = buildRecommendation(
    activeResults,
    amount,
    state.horizonYears,
  );
  const smartSuggestion = buildSmartSuggestion(
    allResults,
    activeResults,
    state.activeInstrumentIds,
  );

  return {
    amount,
    horizonYears: state.horizonYears,
    effectiveInflation,
    displayMode: state.displayMode,
    baseline,
    allResults,
    activeResults,
    chartRows: buildChartRows(baseline, allResults),
    effortRows,
    bestInstrumentId: bestResult?.id ?? null,
    insight,
    recommendation,
    smartSuggestion,
  };
}
