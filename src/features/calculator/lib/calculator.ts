import type {
  BreakdownRow,
  BenchmarkResult,
  BondCalculationResult,
  BondDefinition,
  CalculatorState,
  Insight,
} from "@/features/calculator/domain/types";
import {
  BELKA_TAX_RATE,
  FINE_RANGE_MAX,
  MID_RANGE_MAX,
  MIN_AMOUNT,
  SLIDER_AMOUNT_MAX,
  SLIDER_FINE_BREAK,
  SLIDER_MAX,
  SLIDER_MID_BREAK,
} from "@/features/calculator/lib/constants";
import {
  formatInteger,
  formatMoney,
  formatMoneyRounded,
  formatPercent,
} from "@/features/calculator/lib/formatters";

export function parseLocaleNumber(value: string, fallback: number) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function steppedValue(value: number, delta: number, min = 0) {
  return Math.max(min, Math.round((value + delta) * 10) / 10);
}

export function normaliseAmount(value: number) {
  const safeValue = Math.max(MIN_AMOUNT, value);
  return Math.round(safeValue / 100) * 100;
}

export function parseAmountInput(value: string, fallback: number) {
  const digitsOnly = value.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return fallback;
  }

  return normaliseAmount(Number.parseInt(digitsOnly, 10));
}

export function formatBondCount(count: number) {
  if (count === 1) {
    return "1 obligacja po 100 zł";
  }

  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    return `${formatInteger(count)} obligacje po 100 zł`;
  }

  return `${formatInteger(count)} obligacji po 100 zł`;
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

export function getEffectiveInflation(state: CalculatorState) {
  return state.inflationMode === "custom"
    ? state.customInflation
    : state.inflationPreset;
}

export function calculateBond(
  bond: BondDefinition,
  amount: number,
  inflation: number,
  nbpRate: number,
  useIke: boolean,
): BondCalculationResult {
  const invested = normaliseAmount(amount);
  const termYears = bond.termMonths / 12;
  const breakdown: BreakdownRow[] = [];
  let totalInterest = 0;

  if (bond.id === "OTS") {
    const interest = invested * (bond.firstRate / 100) * (bond.termMonths / 12);
    totalInterest = interest;
    const tax = useIke ? 0 : totalInterest * BELKA_TAX_RATE;
    const netProfit = totalInterest - tax;
    const netReturn = invested + netProfit;

    breakdown.push({
      label: "3 mies.",
      rateLabel: formatPercent(bond.firstRate),
      interest,
      netBalance: netReturn,
      realValue: netReturn / inflationFactor(inflation, termYears),
    });

    return {
      invested,
      totalInterest,
      tax,
      netProfit,
      netReturn,
      effectiveAnnualRate: (netProfit / invested / termYears) * 100,
      realReturn: netReturn / inflationFactor(inflation, termYears),
      termYears,
      termLabel: bond.termLabel,
      breakdown,
    };
  }

  let runningDisplayBalance = invested;
  const regularVariableRate = Math.max(0, nbpRate + bond.margin);

  for (let year = 1; year <= termYears; year += 1) {
    let interest = 0;
    let rateLabel = formatPercent(bond.firstRate);

    if (bond.badgeKind === "fixed") {
      interest = runningDisplayBalance * (bond.firstRate / 100);
      rateLabel = formatPercent(bond.firstRate);

      if (bond.capitalization) {
        runningDisplayBalance += interest;
      }
    }

    if (bond.badgeKind === "variable") {
      if (year === 1) {
        const introMonths = bond.introMonths;
        const remainingMonths = 12 - introMonths;
        interest =
          invested * (bond.firstRate / 100) * (introMonths / 12) +
          invested * (regularVariableRate / 100) * (remainingMonths / 12);
        rateLabel = `${formatPercent(bond.firstRate)} / ${formatPercent(regularVariableRate)}`;
      } else {
        interest = invested * (regularVariableRate / 100);
        rateLabel = formatPercent(regularVariableRate);
      }

      runningDisplayBalance = invested + totalInterest + interest;
    }

    if (bond.badgeKind === "inflation") {
      const currentRate =
        year === 1 ? bond.firstRate : Math.max(0, inflation + bond.margin);
      const interestBase = bond.capitalization ? runningDisplayBalance : invested;
      interest = interestBase * (currentRate / 100);
      rateLabel = formatPercent(currentRate);

      if (bond.capitalization) {
        runningDisplayBalance += interest;
      } else {
        runningDisplayBalance = invested + totalInterest + interest;
      }
    }

    totalInterest += interest;
    const taxToDate = useIke ? 0 : totalInterest * BELKA_TAX_RATE;
    const netBalance = invested + totalInterest - taxToDate;

    breakdown.push({
      label: `${year}`,
      rateLabel,
      interest,
      netBalance,
      realValue: netBalance / inflationFactor(inflation, year),
    });
  }

  const tax = useIke ? 0 : totalInterest * BELKA_TAX_RATE;
  const netProfit = totalInterest - tax;
  const netReturn = invested + netProfit;

  return {
    invested,
    totalInterest,
    tax,
    netProfit,
    netReturn,
    effectiveAnnualRate:
      (Math.pow(1 + netProfit / invested, 1 / termYears) - 1) * 100,
    realReturn: netReturn / inflationFactor(inflation, termYears),
    termYears,
    termLabel: bond.termLabel,
    breakdown,
  };
}

export function calculateBenchmark(
  amount: number,
  annualRate: number,
  termMonths: number,
  inflation: number,
): BenchmarkResult {
  const invested = normaliseAmount(amount);
  const termYears = termMonths / 12;
  const breakdown: BreakdownRow[] = [];
  let totalInterest = 0;
  let totalTax = 0;
  let netBalance = invested;

  if (termMonths < 12) {
    totalInterest = invested * (annualRate / 100) * termYears;
    const tax = totalInterest * BELKA_TAX_RATE;
    const netProfit = totalInterest - tax;
    const netReturn = invested + netProfit;

    breakdown.push({
      label: `${termMonths} mies.`,
      rateLabel: formatPercent(annualRate),
      interest: totalInterest,
      netBalance: netReturn,
      realValue: netReturn / inflationFactor(inflation, termYears),
    });

    return {
      invested,
      totalInterest,
      tax,
      netProfit,
      netReturn,
      effectiveAnnualRate: (netProfit / invested / termYears) * 100,
      realReturn: netReturn / inflationFactor(inflation, termYears),
      breakdown,
    };
  }

  for (let year = 1; year <= termYears; year += 1) {
    const interest = netBalance * (annualRate / 100);
    const tax = interest * BELKA_TAX_RATE;
    const netInterest = interest - tax;

    // Bugfix: renewed lokaty and konta should start each next full period from the post-tax balance, not from the gross interest.
    netBalance += netInterest;
    totalInterest += interest;
    totalTax += tax;

    breakdown.push({
      label: `${year}`,
      rateLabel: formatPercent(annualRate),
      interest,
      netBalance,
      realValue: netBalance / inflationFactor(inflation, year),
    });
  }

  const tax = totalTax;
  const netProfit = totalInterest - tax;
  const netReturn = netBalance;

  return {
    invested,
    totalInterest,
    tax,
    netProfit,
    netReturn,
    effectiveAnnualRate:
      (Math.pow(1 + netProfit / invested, 1 / termYears) - 1) * 100,
    realReturn: netReturn / inflationFactor(inflation, termYears),
    breakdown,
  };
}

export function buildInsight(
  bond: BondDefinition,
  bondResult: BondCalculationResult,
  depositResult: BenchmarkResult,
  inflation: number,
  nbpRate: number,
  depositRate: number,
): Insight {
  const depositDelta = bondResult.netProfit - depositResult.netProfit;

  if (depositDelta < -1) {
    return {
      title: "W tym ustawieniu lokata wypada lepiej",
      text: `Przy ${bond.termLabel.toLowerCase()} lokata na ${formatPercent(
        depositRate,
      )} daje o ${formatMoney(Math.abs(depositDelta))} więcej netto od ${bond.name}.`,
    };
  }

  if (bond.badgeKind === "inflation") {
    return {
      title:
        inflation >= 4
          ? "Wyższa inflacja tu pomaga"
          : "Ta seria łapie wzrost cen od 2. roku",
      text: `Od 2. roku kupon przechodzi na ${formatPercent(
        inflation + bond.margin,
      )}. Dlatego ${bond.name} robi się ciekawsza, gdy ceny rosną szybciej.`,
    };
  }

  if (bond.badgeKind === "variable") {
    return {
      title: "Ta seria żyje stopą NBP",
      text: `Po pierwszych 3 miesiącach kupon liczony jest jako ${formatPercent(
        nbpRate + bond.margin,
      )}. Zmienisz NBP w opcjach i od razu zobaczysz, jak wynik się przesuwa.`,
    };
  }

  if (bond.capitalization) {
    return {
      title: "Tu robi robotę kapitalizacja",
      text: "Odsetki dopisują się do kapitału po każdym roku, więc w kolejnym okresie pracują już także na siebie.",
    };
  }

  return {
    title: "Tu wygrywa prostota i przewidywalność",
    text: "Stawkę znasz z góry, więc wynik nie zależy ani od inflacji, ani od decyzji NBP.",
  };
}

export function getCompareDelta(
  label: string,
  compareTo: string,
  delta: number,
) {
  if (delta >= 0) {
    return {
      positive: true,
      before: `${label} daje `,
      highlight: formatMoneyRounded(delta),
      after: ` więcej niż ${compareTo}`,
    };
  }

  return {
    positive: false,
    before: `${compareTo} daje `,
    highlight: formatMoneyRounded(Math.abs(delta)),
    after: ` więcej niż ${label}`,
  };
}
