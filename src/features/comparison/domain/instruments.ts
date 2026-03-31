import type {
  ComparisonInstrumentDefinition,
  ComparisonSelectableInstrumentId,
} from "@/features/comparison/domain/types";

export const COMPARISON_INSTRUMENT_ORDER: ComparisonSelectableInstrumentId[] = [
  "EDO",
  "COI",
  "TOS",
  "DEPOSIT",
];

export const COMPARISON_INSTRUMENTS: Record<
  ComparisonSelectableInstrumentId,
  ComparisonInstrumentDefinition
> = {
  EDO: {
    id: "EDO",
    kind: "inflation_capitalized",
    label: "EDO 10-letnie",
    shortLabel: "EDO",
    summary: "Kapitalizacja i wyższa marża nad inflacją.",
    termYears: 10,
    firstRate: 5.6,
    margin: 2,
    feePerBond: 3,
    capitalization: true,
    decisionModel: {
      mode: "cycle",
      cycleYears: 10,
    },
    color: "#cb5647",
    fillColor: "rgba(203, 86, 71, 0.12)",
  },
  COI: {
    id: "COI",
    kind: "inflation_payout",
    label: "COI 4-letnie",
    shortLabel: "COI",
    summary: "Odsetki wypłacane co roku i brak kapitalizacji.",
    termYears: 4,
    firstRate: 5,
    margin: 1.5,
    feePerBond: 2,
    capitalization: false,
    decisionModel: {
      mode: "cycle",
      cycleYears: 4,
    },
    color: "#d5942b",
    fillColor: "rgba(213, 148, 43, 0.12)",
  },
  TOS: {
    id: "TOS",
    kind: "fixed_capitalized",
    label: "TOS 3-letnie",
    shortLabel: "TOS",
    summary: "Stałe oprocentowanie i roczna kapitalizacja.",
    termYears: 3,
    firstRate: 4.65,
    margin: 0,
    feePerBond: 1,
    capitalization: true,
    decisionModel: {
      mode: "cycle",
      cycleYears: 3,
    },
    color: "#5c8d67",
    fillColor: "rgba(92, 141, 103, 0.12)",
  },
  DEPOSIT: {
    id: "DEPOSIT",
    kind: "deposit",
    label: "Lokata",
    shortLabel: "Lokata",
    summary: "Coroczne odnawianie na tej samej stopie netto.",
    termYears: 1,
    firstRate: 4,
    margin: 0,
    feePerBond: 0,
    capitalization: true,
    decisionModel: {
      mode: "annual",
      decisionsPerYear: 2,
    },
    color: "#4a6fa5",
    fillColor: "rgba(74, 111, 165, 0.12)",
  },
};

export const BASELINE_COMPARISON_COLOR = "rgba(41, 39, 35, 0.45)";
