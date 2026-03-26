export type BondId = "OTS" | "ROR" | "DOR" | "TOS" | "COI" | "EDO";

export type BondBadgeKind = "fixed" | "variable" | "inflation";

export type InflationMode = "preset" | "custom";

export type PayoutKind = "at_maturity" | "monthly" | "annually";

export type BondCopyContext = {
  effectiveInflation: number;
  nbpRate: number;
};

export type CalculatorState = {
  bondId: BondId;
  amount: number;
  inflationMode: InflationMode;
  inflationPreset: number;
  customInflation: number;
  depositRate: number;
  savingsRate: number;
  nbpRate: number;
  ike: boolean;
};

export type BondDefinition = {
  id: BondId;
  name: BondId;
  title: string;
  pickerLabel: string;
  summaryLabel: string;
  termMonths: number;
  termLabel: string;
  badgeKind: BondBadgeKind;
  badgeLabel: string;
  chipBadgeLabel: string;
  firstRate: number;
  margin: number;
  capitalization: boolean;
  payout: PayoutKind;
  introMonths: number;
  description: (context: BondCopyContext) => string;
  howItWorks: (context: BondCopyContext) => string;
  pros: string[];
  cons: string[];
};

export type BreakdownRow = {
  label: string;
  rateLabel: string;
  interest: number;
  netBalance: number;
  realValue: number;
};

export type BondCalculationResult = {
  invested: number;
  totalInterest: number;
  tax: number;
  netProfit: number;
  netReturn: number;
  effectiveAnnualRate: number;
  realReturn: number;
  termYears: number;
  termLabel: string;
  breakdown: BreakdownRow[];
};

export type BenchmarkResult = {
  invested: number;
  totalInterest: number;
  tax: number;
  netProfit: number;
  netReturn: number;
  effectiveAnnualRate: number;
  realReturn: number;
  breakdown: BreakdownRow[];
};

export type Insight = {
  title: string;
  text: string;
};

