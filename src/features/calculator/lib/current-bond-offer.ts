import type { BondId } from "@/features/calculator/domain/types";

export const CURRENT_BOND_OFFER_MONTH_LABEL = "kwiecień 2026";
export const CURRENT_BOND_OFFER_MONTH_GENITIVE = "kwietnia 2026";
export const CURRENT_NBP_REFERENCE_RATE = 3.75;

export const CURRENT_RETAIL_BOND_OFFER: Record<
  BondId,
  {
    firstRate: number;
    margin: number;
    introMonths: number;
    feePerBond: number;
  }
> = {
  OTS: {
    firstRate: 2,
    margin: 0,
    introMonths: 3,
    feePerBond: 0,
  },
  ROR: {
    firstRate: 4,
    margin: 0,
    introMonths: 1,
    feePerBond: 0.5,
  },
  DOR: {
    firstRate: 4.15,
    margin: 0.15,
    introMonths: 1,
    feePerBond: 0.7,
  },
  TOS: {
    firstRate: 4.4,
    margin: 0,
    introMonths: 36,
    feePerBond: 1,
  },
  COI: {
    firstRate: 4.75,
    margin: 1.5,
    introMonths: 12,
    feePerBond: 2,
  },
  EDO: {
    firstRate: 5.35,
    margin: 2,
    introMonths: 12,
    feePerBond: 3,
  },
};
