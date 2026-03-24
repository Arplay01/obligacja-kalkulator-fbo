/**
 * Bond Calculator Engine
 * 
 * Calculates returns for all Polish Treasury Bond types:
 * OTS (3-month, fixed), ROR (1-year, variable), DOR (2-year, variable),
 * TOS (3-year, fixed), COI (4-year, inflation-linked),
 * EDO (10-year, inflation-linked), ROS (6-year, family), ROD (12-year, family)
 *
 * Design: "Forteca Finansowa" – Dashboard Clarity
 */

export type BondType = 'OTS' | 'ROR' | 'DOR' | 'TOS' | 'COI' | 'EDO' | 'ROS' | 'ROD';

export interface BondInfo {
  type: BondType;
  name: string;
  fullName: string;
  duration: number; // in years (0.25 for OTS)
  durationLabel: string;
  category: 'fixed' | 'variable' | 'inflation';
  categoryLabel: string;
  firstYearRate: number; // current first-year rate
  margin: number; // margin above inflation or NBP rate (for year 2+)
  earlyExitFee: number; // per bond in PLN
  capitalization: 'none' | 'monthly_payout' | 'yearly_payout' | 'yearly_cap' | 'at_maturity';
  capitalizationLabel: string;
  isFamily: boolean;
  color: string;
  description: string;
}

export const BONDS: BondInfo[] = [
  {
    type: 'OTS',
    name: 'OTS',
    fullName: 'Obligacje 3-miesięczne',
    duration: 0.25,
    durationLabel: '3 miesiące',
    category: 'fixed',
    categoryLabel: 'Stałoprocentowe',
    firstYearRate: 2.50,
    margin: 0,
    earlyExitFee: 0,
    capitalization: 'at_maturity',
    capitalizationLabel: 'Przy wykupie',
    isFamily: false,
    color: '#94A3B8',
    description: 'Znasz zysk z góry. Idealne na krótki okres.',
  },
  {
    type: 'ROR',
    name: 'ROR',
    fullName: 'Obligacje roczne',
    duration: 1,
    durationLabel: '1 rok',
    category: 'variable',
    categoryLabel: 'Zmiennoprocentowe',
    firstYearRate: 4.25,
    margin: 0.00,
    earlyExitFee: 0.50,
    capitalization: 'monthly_payout',
    capitalizationLabel: 'Odsetki co miesiąc',
    isFamily: false,
    color: '#0EA5E9',
    description: 'Oprocentowanie zmienia się ze stopą NBP. Odsetki co miesiąc.',
  },
  {
    type: 'DOR',
    name: 'DOR',
    fullName: 'Obligacje 2-letnie',
    duration: 2,
    durationLabel: '2 lata',
    category: 'variable',
    categoryLabel: 'Zmiennoprocentowe',
    firstYearRate: 4.40,
    margin: 0.15,
    earlyExitFee: 0.70,
    capitalization: 'monthly_payout',
    capitalizationLabel: 'Odsetki co miesiąc',
    isFamily: false,
    color: '#06B6D4',
    description: 'Jak ROR, ale na 2 lata z wyższą marżą.',
  },
  {
    type: 'TOS',
    name: 'TOS',
    fullName: 'Obligacje 3-letnie',
    duration: 3,
    durationLabel: '3 lata',
    category: 'fixed',
    categoryLabel: 'Stałoprocentowe',
    firstYearRate: 4.65,
    margin: 0,
    earlyExitFee: 1.00,
    capitalization: 'yearly_cap',
    capitalizationLabel: 'Kapitalizacja roczna',
    isFamily: false,
    color: '#8B5CF6',
    description: 'Stałe oprocentowanie przez 3 lata. Pewność zysku.',
  },
  {
    type: 'COI',
    name: 'COI',
    fullName: 'Obligacje 4-letnie',
    duration: 4,
    durationLabel: '4 lata',
    category: 'inflation',
    categoryLabel: 'Indeksowane inflacją',
    firstYearRate: 5.00,
    margin: 1.50,
    earlyExitFee: 1.00,
    capitalization: 'yearly_payout',
    capitalizationLabel: 'Odsetki co rok',
    isFamily: false,
    color: '#10B981',
    description: 'Chronią przed inflacją. Odsetki wypłacane co rok.',
  },
  {
    type: 'EDO',
    name: 'EDO',
    fullName: 'Obligacje 10-letnie',
    duration: 10,
    durationLabel: '10 lat',
    category: 'inflation',
    categoryLabel: 'Indeksowane inflacją',
    firstYearRate: 5.60,
    margin: 2.00,
    earlyExitFee: 3.00,
    capitalization: 'yearly_cap',
    capitalizationLabel: 'Kapitalizacja roczna',
    isFamily: false,
    color: '#22C55E',
    description: 'Najwyższa marża. Kapitalizacja odsetek = efekt kuli śnieżnej.',
  },
  {
    type: 'ROS',
    name: 'ROS',
    fullName: 'Obligacje rodzinne 6-letnie',
    duration: 6,
    durationLabel: '6 lat',
    category: 'inflation',
    categoryLabel: 'Indeksowane inflacją',
    firstYearRate: 5.20,
    margin: 1.75,
    earlyExitFee: 1.00,
    capitalization: 'yearly_cap',
    capitalizationLabel: 'Kapitalizacja roczna',
    isFamily: true,
    color: '#F59E0B',
    description: 'Rodzinne – dostępne dla beneficjentów 800+. Kapitalizacja roczna.',
  },
  {
    type: 'ROD',
    name: 'ROD',
    fullName: 'Obligacje rodzinne 12-letnie',
    duration: 12,
    durationLabel: '12 lat',
    category: 'inflation',
    categoryLabel: 'Indeksowane inflacją',
    firstYearRate: 5.85,
    margin: 2.25,
    earlyExitFee: 2.00,
    capitalization: 'yearly_cap',
    capitalizationLabel: 'Kapitalizacja roczna',
    isFamily: true,
    color: '#EF4444',
    description: 'Najwyższe oprocentowanie. Rodzinne, 12 lat, kapitalizacja.',
  },
];

export interface CalculatorInputs {
  investmentAmount: number; // in PLN
  inflationRates: number[]; // % per year (up to 12 entries)
  nbpRate: number; // % NBP reference rate
  depositRate: number; // % for comparison (deposit/savings account)
  useIKE: boolean; // if true, no Belka tax
  selectedBonds: BondType[];
}

export interface YearlyBreakdown {
  year: number;
  principal: number;
  interestEarned: number;
  interestPaidOut: number;
  cumulativeInterest: number;
  totalValue: number;
  effectiveRate: number;
  realReturn: number; // after inflation
}

export interface BondResult {
  bondType: BondType;
  bondInfo: BondInfo;
  totalInvested: number;
  totalAtMaturity: number;
  totalInterest: number;
  totalInterestAfterTax: number;
  effectiveAnnualRate: number;
  realReturnRate: number; // vs inflation
  yearlyBreakdown: YearlyBreakdown[];
  earlyExitCost: number;
}

export interface CalculatorResults {
  bonds: BondResult[];
  depositResult: DepositResult;
  depositPerBond: Map<BondType, DepositResult>;
  bestBond: BondType | null;
}

export interface DepositResult {
  totalInvested: number;
  totalAtMaturity: number;
  totalInterest: number;
  totalInterestAfterTax: number;
  effectiveAnnualRate: number;
  realReturnRate: number;
  years: number;
}

const BELKA_TAX = 0.19;

function getInflationForYear(inflationRates: number[], year: number): number {
  if (year <= 0) return inflationRates[0] ?? 3.0;
  const idx = Math.min(year - 1, inflationRates.length - 1);
  return inflationRates[idx] ?? inflationRates[inflationRates.length - 1] ?? 3.0;
}

function calculateBond(
  bond: BondInfo,
  inputs: CalculatorInputs
): BondResult {
  const numBonds = Math.floor(inputs.investmentAmount / 100);
  const totalInvested = numBonds * 100;
  
  if (numBonds === 0) {
    return {
      bondType: bond.type,
      bondInfo: bond,
      totalInvested: 0,
      totalAtMaturity: 0,
      totalInterest: 0,
      totalInterestAfterTax: 0,
      effectiveAnnualRate: 0,
      realReturnRate: 0,
      yearlyBreakdown: [],
      earlyExitCost: numBonds * bond.earlyExitFee,
    };
  }

  const taxRate = inputs.useIKE ? 0 : BELKA_TAX;
  const yearlyBreakdown: YearlyBreakdown[] = [];
  
  let currentPrincipal = totalInvested;
  let cumulativeInterest = 0;
  let totalInterestPaidOut = 0;
  
  const durationYears = bond.duration < 1 ? 1 : Math.ceil(bond.duration);
  const actualPeriods = bond.type === 'OTS' ? 1 : durationYears;

  for (let year = 1; year <= actualPeriods; year++) {
    const inflation = getInflationForYear(inputs.inflationRates, year);
    let rate: number;

    if (bond.type === 'OTS') {
      // Fixed rate for 3 months, annualized
      rate = bond.firstYearRate;
      const quarterInterest = currentPrincipal * (rate / 100) * 0.25;
      const interestAfterTax = quarterInterest * (1 - taxRate);
      cumulativeInterest += interestAfterTax;
      
      yearlyBreakdown.push({
        year: 1,
        principal: currentPrincipal,
        interestEarned: quarterInterest,
        interestPaidOut: interestAfterTax,
        cumulativeInterest,
        totalValue: currentPrincipal + interestAfterTax,
        effectiveRate: (interestAfterTax / currentPrincipal) * 400, // annualized
        realReturn: ((interestAfterTax / currentPrincipal) * 400) - inflation,
      });
      continue;
    }

    // Determine rate for this year
    if (year === 1) {
      rate = bond.firstYearRate;
    } else {
      switch (bond.category) {
        case 'fixed':
          rate = bond.firstYearRate;
          break;
        case 'variable':
          rate = Math.max(0, inputs.nbpRate + bond.margin);
          break;
        case 'inflation':
          rate = Math.max(0, inflation + bond.margin);
          break;
        default:
          rate = bond.firstYearRate;
      }
    }

    const interestEarned = currentPrincipal * (rate / 100);

    switch (bond.capitalization) {
      case 'monthly_payout': {
        // Interest paid out monthly (ROR, DOR)
        const interestAfterTax = interestEarned * (1 - taxRate);
        totalInterestPaidOut += interestAfterTax;
        cumulativeInterest += interestAfterTax;
        // Principal stays the same
        break;
      }
      case 'yearly_payout': {
        // Interest paid out yearly (COI)
        const interestAfterTax = interestEarned * (1 - taxRate);
        totalInterestPaidOut += interestAfterTax;
        cumulativeInterest += interestAfterTax;
        break;
      }
      case 'yearly_cap': {
        // Interest capitalized (TOS, EDO, ROS, ROD)
        currentPrincipal += interestEarned;
        cumulativeInterest += interestEarned;
        break;
      }
      case 'at_maturity': {
        cumulativeInterest += interestEarned;
        break;
      }
    }

    yearlyBreakdown.push({
      year,
      principal: currentPrincipal,
      interestEarned,
      interestPaidOut: bond.capitalization === 'monthly_payout' || bond.capitalization === 'yearly_payout' 
        ? interestEarned * (1 - taxRate) : 0,
      cumulativeInterest,
      totalValue: bond.capitalization === 'yearly_cap' 
        ? currentPrincipal 
        : totalInvested + cumulativeInterest,
      effectiveRate: rate,
      realReturn: rate - inflation,
    });
  }

  // Final calculation
  let totalAtMaturity: number;
  let totalInterest: number;
  let totalInterestAfterTax: number;

  if (bond.capitalization === 'yearly_cap') {
    // Capitalized bonds: tax on total gain at maturity
    totalInterest = currentPrincipal - totalInvested;
    totalInterestAfterTax = totalInterest * (1 - taxRate);
    totalAtMaturity = totalInvested + totalInterestAfterTax;
  } else if (bond.capitalization === 'monthly_payout' || bond.capitalization === 'yearly_payout') {
    // Already taxed on payout
    totalInterest = cumulativeInterest / (1 - taxRate); // gross
    totalInterestAfterTax = cumulativeInterest;
    totalAtMaturity = totalInvested + totalInterestAfterTax;
  } else {
    // At maturity (OTS)
    totalInterest = cumulativeInterest / (1 - taxRate);
    totalInterestAfterTax = cumulativeInterest;
    totalAtMaturity = totalInvested + totalInterestAfterTax;
  }

  const years = bond.duration;
  const effectiveAnnualRate = years > 0 
    ? ((totalAtMaturity / totalInvested) ** (1 / years) - 1) * 100
    : (totalInterestAfterTax / totalInvested) * 100;

  // Average inflation over the period
  const avgInflation = Array.from({ length: Math.ceil(years) }, (_, i) => 
    getInflationForYear(inputs.inflationRates, i + 1)
  ).reduce((a, b) => a + b, 0) / Math.ceil(years);

  const realReturnRate = effectiveAnnualRate - avgInflation;

  return {
    bondType: bond.type,
    bondInfo: bond,
    totalInvested,
    totalAtMaturity,
    totalInterest,
    totalInterestAfterTax,
    effectiveAnnualRate,
    realReturnRate,
    yearlyBreakdown,
    earlyExitCost: numBonds * bond.earlyExitFee,
  };
}

function calculateDeposit(inputs: CalculatorInputs, years: number): DepositResult {
  const taxRate = inputs.useIKE ? 0 : BELKA_TAX;
  const rate = inputs.depositRate / 100;
  
  let total = inputs.investmentAmount;
  let totalInterest = 0;
  
  for (let y = 0; y < Math.max(1, years); y++) {
    const interest = total * rate;
    const afterTax = interest * (1 - taxRate);
    totalInterest += afterTax;
    total += afterTax;
  }

  const avgInflation = Array.from({ length: Math.max(1, Math.ceil(years)) }, (_, i) => 
    getInflationForYear(inputs.inflationRates, i + 1)
  ).reduce((a, b) => a + b, 0) / Math.max(1, Math.ceil(years));

  const effectiveRate = years > 0 
    ? ((total / inputs.investmentAmount) ** (1 / years) - 1) * 100
    : (totalInterest / inputs.investmentAmount) * 100;

  return {
    totalInvested: inputs.investmentAmount,
    totalAtMaturity: total,
    totalInterest: totalInterest / (1 - taxRate),
    totalInterestAfterTax: totalInterest,
    effectiveAnnualRate: effectiveRate,
    realReturnRate: effectiveRate - avgInflation,
    years,
  };
}

export function calculateAll(inputs: CalculatorInputs): CalculatorResults {
  const selectedBondInfos = BONDS.filter(b => inputs.selectedBonds.includes(b.type));
  
  const bondResults = selectedBondInfos.map(bond => calculateBond(bond, inputs));
  
  // Find the longest duration among selected bonds for deposit comparison
  const maxDuration = Math.max(...selectedBondInfos.map(b => b.duration), 1);
  const depositResult = calculateDeposit(inputs, maxDuration);
  
  // Per-bond deposit comparison (same duration as each bond)
  const depositPerBond = new Map<BondType, DepositResult>();
  for (const bond of selectedBondInfos) {
    depositPerBond.set(bond.type, calculateDeposit(inputs, bond.duration));
  }
  
  // Find best bond by total return after tax
  let bestBond: BondType | null = null;
  let bestReturn = -Infinity;
  for (const result of bondResults) {
    const depForBond = depositPerBond.get(result.bondType);
    if (result.totalInterestAfterTax > bestReturn && result.totalInvested > 0) {
      bestReturn = result.totalInterestAfterTax;
      bestBond = result.bondType;
    }
  }

  return {
    bonds: bondResults,
    depositResult,
    depositPerBond,
    bestBond,
  };
}

export function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatPercentSimple(value: number): string {
  return `${value.toFixed(2)}%`;
}
