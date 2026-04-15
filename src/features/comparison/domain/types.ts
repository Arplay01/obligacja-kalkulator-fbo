export type ComparisonInstrumentId =
  | "EDO"
  | "COI"
  | "TOS"
  | "DEPOSIT"
  | "INACTION";

export type ComparisonSelectableInstrumentId = Exclude<
  ComparisonInstrumentId,
  "INACTION"
>;

export type ComparisonInstrumentKind =
  | "inflation_capitalized"
  | "inflation_payout"
  | "fixed_capitalized"
  | "deposit"
  | "baseline";

export type ComparisonInflationMode = "preset" | "custom";

export type ComparisonValueMode = "net" | "real";

export type ComparisonDecisionModel =
  | {
      mode: "cycle";
      cycleYears: number;
    }
  | {
      mode: "annual";
      decisionsPerYear: number;
    };

export type ComparisonInstrumentDefinition = {
  id: ComparisonSelectableInstrumentId;
  kind: Exclude<ComparisonInstrumentKind, "baseline">;
  label: string;
  shortLabel: string;
  summary: string;
  termYears: number;
  firstRate: number;
  margin: number;
  feePerBond: number;
  capitalization: boolean;
  decisionModel: ComparisonDecisionModel;
  color: string;
  fillColor: string;
};

export type ComparisonSeriesPoint = {
  year: number;
  label: string;
  netValue: number;
  realValue: number;
  decisions: number;
  hasDecisionMarker: boolean;
  markerLabel: string | null;
  isEarlyExit: boolean;
  earlyExitFee: number;
  preExitNetValue: number;
  preExitRealValue: number;
};

export type ComparisonMarker = {
  year: number;
  label: string;
};

export type ComparisonInstrumentResult = {
  id: ComparisonSelectableInstrumentId;
  label: string;
  shortLabel: string;
  summary: string;
  color: string;
  fillColor: string;
  finalNet: number;
  finalReal: number;
  netProfit: number;
  realProfit: number;
  decisions: number;
  markers: ComparisonMarker[];
  series: ComparisonSeriesPoint[];
};

export type ComparisonBaselineResult = {
  id: "INACTION";
  label: string;
  shortLabel: string;
  color: string;
  finalNet: number;
  finalReal: number;
  series: ComparisonSeriesPoint[];
};

export type ComparisonInsight = {
  winnerId: "EDO" | "COI";
  deltaNet: number;
  deltaReal: number;
};

export type ComparisonChartRow = {
  year: number;
  label: string;
  EDO_net: number;
  EDO_real: number;
  EDO_preExitNet: number;
  EDO_preExitReal: number;
  COI_net: number;
  COI_real: number;
  COI_preExitNet: number;
  COI_preExitReal: number;
  TOS_net: number;
  TOS_real: number;
  TOS_preExitNet: number;
  TOS_preExitReal: number;
  DEPOSIT_net: number;
  DEPOSIT_real: number;
  DEPOSIT_preExitNet: number;
  DEPOSIT_preExitReal: number;
  INACTION_net: number;
  INACTION_real: number;
  details: Record<ComparisonInstrumentId, ComparisonSeriesPoint>;
};

export type ComparisonEffortRow = {
  id: ComparisonSelectableInstrumentId;
  label: string;
  color: string;
  finalValue: number;
  profit: number;
  decisions: number;
  isBest: boolean;
  hasEarlyExit: boolean;
  earlyExitFee: number;
};

export type ComparisonRecommendation = {
  bestId: ComparisonSelectableInstrumentId;
  bestLabel: string;
  bestFinalNet: number;
  bestProfit: number;
  isTermAligned: boolean;
  earlyExitFee: number;
  earlyExitYearsBefore: number;
  headline: string;
  bestBody: string;
  inactionBody: string;
  depositHeading: string;
  depositBody: string;
};

export type ComparisonSmartSuggestion = {
  instrumentId: ComparisonSelectableInstrumentId;
  label: string;
  delta: number;
  finalNet: number;
} | null;

export type ComparisonScenarioState = {
  amount: number;
  horizonYears: number;
  inflationMode: ComparisonInflationMode;
  inflationPreset: number;
  customInflation: number;
  depositRate: number;
  activeInstrumentIds: ComparisonSelectableInstrumentId[];
  displayMode: ComparisonValueMode;
};

export type ComparisonScenarioResult = {
  amount: number;
  horizonYears: number;
  effectiveInflation: number;
  displayMode: ComparisonValueMode;
  baseline: ComparisonBaselineResult;
  allResults: ComparisonInstrumentResult[];
  activeResults: ComparisonInstrumentResult[];
  chartRows: ComparisonChartRow[];
  effortRows: ComparisonEffortRow[];
  bestInstrumentId: ComparisonSelectableInstrumentId | null;
  insight: ComparisonInsight | null;
  recommendation: ComparisonRecommendation;
  smartSuggestion: ComparisonSmartSuggestion;
};
