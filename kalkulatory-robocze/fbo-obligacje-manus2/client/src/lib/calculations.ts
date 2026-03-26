/**
 * Bond calculation engine for Polish Treasury Bonds
 * Data source: obligacjeskarbowe.pl, gov.pl - March 2026 offer
 * 
 * Design: "Ścieżka Decyzji" - all calculations are transparent and honest.
 * If a deposit beats bonds in a given scenario, we show it clearly.
 */

export const BELKA_TAX_RATE = 0.19;

// Current NBP reference rate (March 2026)
export const NBP_REFERENCE_RATE = 3.75; // NBP cut to 3.75% in March 2026

export interface BondType {
  id: string;
  name: string;
  fullName: string;
  termMonths: number;
  termLabel: string;
  type: 'fixed' | 'variable' | 'inflation';
  typeLabel: string;
  firstPeriodRate: number; // in %
  margin: number; // in % (for variable/inflation bonds)
  capitalization: boolean;
  interestPayment: 'monthly' | 'annually' | 'at_maturity';
  earlyRedemptionFee: number; // PLN per bond
  familyOnly: boolean;
  description: string;
  prosText: string;
  consText: string;
}

export const BOND_TYPES: BondType[] = [
  {
    id: 'OTS',
    name: 'OTS',
    fullName: 'Obligacje 3-miesięczne',
    termMonths: 3,
    termLabel: '3 miesiące',
    type: 'fixed',
    typeLabel: 'Stałe oprocentowanie',
    firstPeriodRate: 2.50,
    margin: 0,
    capitalization: false,
    interestPayment: 'at_maturity',
    earlyRedemptionFee: 0,
    familyOnly: false,
    description: 'Znasz zysk z góry. Po 3 miesiącach dostajesz pieniądze z odsetkami.',
    prosText: 'Najkrótszy termin, pewny zysk, brak opłaty za wcześniejszy wykup',
    consText: 'Najniższe oprocentowanie ze wszystkich obligacji',
  },
  {
    id: 'ROR',
    name: 'ROR',
    fullName: 'Obligacje roczne',
    termMonths: 12,
    termLabel: '1 rok',
    type: 'variable',
    typeLabel: 'Zmienne oprocentowanie',
    firstPeriodRate: 4.25,
    margin: 0.00,
    capitalization: false,
    interestPayment: 'monthly',
    earlyRedemptionFee: 0.50,
    familyOnly: false,
    description: 'Odsetki co miesiąc na konto. Oprocentowanie podąża za stopą NBP.',
    prosText: 'Comiesięczne odsetki, oprocentowanie rośnie gdy stopy rosną',
    consText: 'Oprocentowanie spada gdy NBP obniża stopy, niska marża',
  },
  {
    id: 'DOR',
    name: 'DOR',
    fullName: 'Obligacje 2-letnie',
    termMonths: 24,
    termLabel: '2 lata',
    type: 'variable',
    typeLabel: 'Zmienne oprocentowanie',
    firstPeriodRate: 4.40,
    margin: 0.15,
    capitalization: false,
    interestPayment: 'monthly',
    earlyRedemptionFee: 0.70,
    familyOnly: false,
    description: 'Jak ROR, ale na 2 lata i z niewielką marżą ponad stopę NBP.',
    prosText: 'Comiesięczne odsetki, lekko wyższa marża niż ROR',
    consText: 'Dłuższe zamrożenie pieniędzy, oprocentowanie zależy od decyzji NBP',
  },
  {
    id: 'TOS',
    name: 'TOS',
    fullName: 'Obligacje 3-letnie',
    termMonths: 36,
    termLabel: '3 lata',
    type: 'fixed',
    typeLabel: 'Stałe oprocentowanie',
    firstPeriodRate: 4.65,
    margin: 0,
    capitalization: true,
    interestPayment: 'at_maturity',
    earlyRedemptionFee: 1.00,
    familyOnly: false,
    description: 'Stałe oprocentowanie przez 3 lata z kapitalizacją. Wiesz ile dostaniesz.',
    prosText: 'Pewny zysk na 3 lata, kapitalizacja odsetek zwiększa zysk',
    consText: 'Nie chroni przed inflacją, 3 lata zamrożenia',
  },
  {
    id: 'COI',
    name: 'COI',
    fullName: 'Obligacje 4-letnie',
    termMonths: 48,
    termLabel: '4 lata',
    type: 'inflation',
    typeLabel: 'Indeksowane inflacją',
    firstPeriodRate: 5.00,
    margin: 1.50,
    capitalization: false,
    interestPayment: 'annually',
    earlyRedemptionFee: 2.00,
    familyOnly: false,
    description: 'Od 2. roku oprocentowanie = inflacja + 1,5%. Chroni przed wzrostem cen.',
    prosText: 'Ochrona przed inflacją, coroczna wypłata odsetek',
    consText: '4 lata zamrożenia, przy niskiej inflacji zysk może być niższy niż z lokaty',
  },
  {
    id: 'EDO',
    name: 'EDO',
    fullName: 'Obligacje 10-letnie',
    termMonths: 120,
    termLabel: '10 lat',
    type: 'inflation',
    typeLabel: 'Indeksowane inflacją',
    firstPeriodRate: 5.60,
    margin: 2.00,
    capitalization: true,
    interestPayment: 'at_maturity',
    earlyRedemptionFee: 3.00,
    familyOnly: false,
    description: 'Najwyższa marża + kapitalizacja. Odsetki pracują na odsetki przez 10 lat.',
    prosText: 'Najwyższy potencjalny zysk, kapitalizacja, silna ochrona przed inflacją',
    consText: 'Bardzo długi termin (10 lat), pieniądze zamrożone',
  },
];

// Family bonds (ROS, ROD) - shown only when user indicates Family 800+
export const FAMILY_BONDS: BondType[] = [
  {
    id: 'ROS',
    name: 'ROS',
    fullName: 'Obligacje rodzinne 6-letnie',
    termMonths: 72,
    termLabel: '6 lat',
    type: 'inflation',
    typeLabel: 'Indeksowane inflacją',
    firstPeriodRate: 5.20,
    margin: 2.00,
    capitalization: true,
    interestPayment: 'at_maturity',
    earlyRedemptionFee: 2.00,
    familyOnly: true,
    description: 'Jak EDO, ale na 6 lat. Tylko dla beneficjentów programu Rodzina 800+.',
    prosText: 'Wysoka marża, kapitalizacja, krócej niż EDO',
    consText: 'Tylko dla rodzin z 800+, 6 lat zamrożenia',
  },
  {
    id: 'ROD',
    name: 'ROD',
    fullName: 'Obligacje rodzinne 12-letnie',
    termMonths: 144,
    termLabel: '12 lat',
    type: 'inflation',
    typeLabel: 'Indeksowane inflacją',
    firstPeriodRate: 5.85,
    margin: 2.50,
    capitalization: true,
    interestPayment: 'at_maturity',
    earlyRedemptionFee: 3.00,
    familyOnly: true,
    description: 'Najwyższa marża ze wszystkich obligacji. 12 lat z kapitalizacją.',
    prosText: 'Najwyższa marża (2,5%), kapitalizacja przez 12 lat',
    consText: 'Bardzo długi termin, tylko dla rodzin z 800+',
  },
];

export interface CalculationResult {
  productName: string;
  productId: string;
  productType: 'bond' | 'deposit' | 'savings';
  termMonths: number;
  termLabel: string;
  invested: number;
  grossReturn: number;
  tax: number;
  netReturn: number;
  netProfit: number;
  effectiveAnnualRate: number; // net, after tax
  realReturn: number; // after inflation
  yearlyBreakdown: YearlyData[];
  typeLabel: string;
  description: string;
  prosText: string;
  consText: string;
  earlyRedemptionFee: number;
}

export interface YearlyData {
  year: number;
  balance: number;
  interest: number;
  cumulativeInterest: number;
  inflationLoss: number;
  realValue: number;
}

/**
 * Calculate bond returns
 */
export function calculateBond(
  bond: BondType,
  amount: number,
  expectedInflation: number,
  expectedNbpRate: number = NBP_REFERENCE_RATE,
): CalculationResult {
  const numBonds = Math.floor(amount / 100);
  const invested = numBonds * 100;
  if (invested === 0) {
    return emptyResult(bond.name, bond.id, 'bond', bond.termMonths, bond.termLabel, amount, bond.typeLabel, bond.description, bond.prosText, bond.consText);
  }

  const yearlyBreakdown: YearlyData[] = [];
  let balance = invested;
  let totalInterest = 0;
  const termYears = bond.termMonths / 12;

  if (bond.type === 'fixed') {
    const rate = bond.firstPeriodRate / 100;
    
    if (bond.id === 'OTS') {
      // 3-month bond: simple interest for 3 months
      const interest = invested * rate * (3 / 12);
      const tax = interest * BELKA_TAX_RATE;
      const netProfit = interest - tax;
      const inflationLoss = invested * (expectedInflation / 100) * (3 / 12);
      
      yearlyBreakdown.push({
        year: 0.25,
        balance: invested + interest,
        interest: interest,
        cumulativeInterest: interest,
        inflationLoss,
        realValue: invested + netProfit - inflationLoss,
      });

      const effectiveAnnualRate = ((netProfit / invested) / (3 / 12)) * 100;
      
      return {
        productName: bond.fullName,
        productId: bond.id,
        productType: 'bond',
        termMonths: bond.termMonths,
        termLabel: bond.termLabel,
        invested,
        grossReturn: invested + interest,
        tax: tax,
        netReturn: invested + netProfit,
        netProfit,
        effectiveAnnualRate,
        realReturn: invested + netProfit - inflationLoss,
        yearlyBreakdown,
        typeLabel: bond.typeLabel,
        description: bond.description,
        prosText: bond.prosText,
        consText: bond.consText,
        earlyRedemptionFee: bond.earlyRedemptionFee,
      };
    }

    // TOS: fixed with capitalization
    if (bond.capitalization) {
      let currentBalance = invested;
      for (let year = 1; year <= termYears; year++) {
        const yearInterest = currentBalance * rate;
        currentBalance += yearInterest;
        totalInterest += yearInterest;
        const inflationLoss = invested * Math.pow(1 + expectedInflation / 100, year) - invested;
        
        yearlyBreakdown.push({
          year,
          balance: currentBalance,
          interest: yearInterest,
          cumulativeInterest: totalInterest,
          inflationLoss,
          realValue: currentBalance - totalInterest * BELKA_TAX_RATE - inflationLoss,
        });
      }
    } else {
      for (let year = 1; year <= termYears; year++) {
        const yearInterest = invested * rate;
        totalInterest += yearInterest;
        balance = invested + totalInterest;
        const inflationLoss = invested * Math.pow(1 + expectedInflation / 100, year) - invested;
        
        yearlyBreakdown.push({
          year,
          balance,
          interest: yearInterest,
          cumulativeInterest: totalInterest,
          inflationLoss,
          realValue: balance - totalInterest * BELKA_TAX_RATE - inflationLoss,
        });
      }
    }
  } else if (bond.type === 'variable') {
    // ROR, DOR: variable rate based on NBP reference rate
    const margin = bond.margin / 100;
    
    for (let year = 1; year <= termYears; year++) {
      // First month at first period rate, rest at NBP + margin
      const firstMonthRate = year === 1 ? bond.firstPeriodRate / 100 : (expectedNbpRate / 100 + margin);
      const restRate = expectedNbpRate / 100 + margin;
      
      let yearInterest = 0;
      if (year === 1) {
        yearInterest = invested * (firstMonthRate / 12) + invested * (restRate / 12) * 11;
      } else {
        yearInterest = invested * (restRate / 12) * 12;
      }
      
      totalInterest += yearInterest;
      balance = invested + totalInterest;
      const inflationLoss = invested * Math.pow(1 + expectedInflation / 100, year) - invested;
      
      yearlyBreakdown.push({
        year,
        balance,
        interest: yearInterest,
        cumulativeInterest: totalInterest,
        inflationLoss,
        realValue: balance - totalInterest * BELKA_TAX_RATE - inflationLoss,
      });
    }
  } else if (bond.type === 'inflation') {
    // COI, EDO, ROS, ROD: inflation-indexed
    const margin = bond.margin / 100;
    let currentBalance = invested;
    
    for (let year = 1; year <= termYears; year++) {
      let rate: number;
      if (year === 1) {
        rate = bond.firstPeriodRate / 100;
      } else {
        rate = Math.max(0, expectedInflation / 100 + margin);
      }
      
      const yearInterest = currentBalance * rate;
      totalInterest += yearInterest;
      
      if (bond.capitalization) {
        currentBalance += yearInterest;
        balance = currentBalance;
      } else {
        balance = invested + totalInterest;
      }
      
      const inflationLoss = invested * Math.pow(1 + expectedInflation / 100, year) - invested;
      
      yearlyBreakdown.push({
        year,
        balance,
        interest: yearInterest,
        cumulativeInterest: totalInterest,
        inflationLoss,
        realValue: balance - totalInterest * BELKA_TAX_RATE - inflationLoss,
      });
    }
  }

  const tax = totalInterest * BELKA_TAX_RATE;
  const netProfit = totalInterest - tax;
  const inflationTotal = invested * Math.pow(1 + expectedInflation / 100, termYears) - invested;
  const effectiveAnnualRate = (Math.pow(1 + netProfit / invested, 1 / termYears) - 1) * 100;

  return {
    productName: bond.fullName,
    productId: bond.id,
    productType: 'bond',
    termMonths: bond.termMonths,
    termLabel: bond.termLabel,
    invested,
    grossReturn: balance,
    tax,
    netReturn: invested + netProfit,
    netProfit,
    effectiveAnnualRate,
    realReturn: invested + netProfit - inflationTotal,
    yearlyBreakdown,
    typeLabel: bond.typeLabel,
    description: bond.description,
    prosText: bond.prosText,
    consText: bond.consText,
    earlyRedemptionFee: bond.earlyRedemptionFee,
  };
}

/**
 * Calculate deposit/savings account returns
 */
export function calculateDeposit(
  amount: number,
  annualRate: number,
  termMonths: number,
  expectedInflation: number,
  name: string = 'Lokata bankowa',
  type: 'deposit' | 'savings' = 'deposit',
): CalculationResult {
  const rate = annualRate / 100;
  const termYears = termMonths / 12;
  const yearlyBreakdown: YearlyData[] = [];
  
  let totalInterest = 0;
  
  if (termMonths <= 12) {
    // Short-term deposit: simple interest
    const interest = amount * rate * (termMonths / 12);
    const tax = interest * BELKA_TAX_RATE;
    const netProfit = interest - tax;
    const inflationLoss = amount * (expectedInflation / 100) * (termMonths / 12);
    
    yearlyBreakdown.push({
      year: termYears,
      balance: amount + interest,
      interest,
      cumulativeInterest: interest,
      inflationLoss,
      realValue: amount + netProfit - inflationLoss,
    });

    const effectiveAnnualRate = termMonths < 12 
      ? ((netProfit / amount) / (termMonths / 12)) * 100
      : (netProfit / amount) * 100;

    const termLabel = termMonths === 3 ? '3 miesiące' 
      : termMonths === 6 ? '6 miesięcy' 
      : termMonths === 12 ? '1 rok' 
      : `${termMonths} mies.`;

    return {
      productName: name,
      productId: type,
      productType: type,
      termMonths,
      termLabel,
      invested: amount,
      grossReturn: amount + interest,
      tax,
      netReturn: amount + netProfit,
      netProfit,
      effectiveAnnualRate,
      realReturn: amount + netProfit - inflationLoss,
      yearlyBreakdown,
      typeLabel: type === 'deposit' ? 'Lokata' : 'Konto oszczędnościowe',
      description: type === 'deposit' 
        ? 'Pieniądze zamrożone na określony czas. Oprocentowanie znane z góry.'
        : 'Pieniądze dostępne w każdej chwili. Oprocentowanie może się zmieniać.',
      prosText: type === 'deposit'
        ? 'Gwarancja BFG do 100 tys. EUR, pewny zysk, prostota'
        : 'Pełna dostępność pieniędzy, gwarancja BFG, prostota',
      consText: type === 'deposit'
        ? 'Pieniądze zamrożone, przy zerwaniu tracisz odsetki, nie chroni przed inflacją'
        : 'Niższe oprocentowanie, bank może zmienić stawkę w dowolnym momencie',
      earlyRedemptionFee: 0,
    };
  }

  // Multi-year: compound annually
  let balance = amount;
  for (let year = 1; year <= Math.ceil(termYears); year++) {
    const yearInterest = balance * rate;
    totalInterest += yearInterest;
    balance += yearInterest;
    const inflationLoss = amount * Math.pow(1 + expectedInflation / 100, year) - amount;
    
    yearlyBreakdown.push({
      year,
      balance,
      interest: yearInterest,
      cumulativeInterest: totalInterest,
      inflationLoss,
      realValue: balance - totalInterest * BELKA_TAX_RATE - inflationLoss,
    });
  }

  const tax = totalInterest * BELKA_TAX_RATE;
  const netProfit = totalInterest - tax;
  const inflationTotal = amount * Math.pow(1 + expectedInflation / 100, termYears) - amount;
  const effectiveAnnualRate = (Math.pow(1 + netProfit / amount, 1 / termYears) - 1) * 100;

  const termLabel = termMonths === 24 ? '2 lata'
    : termMonths === 36 ? '3 lata'
    : termMonths === 48 ? '4 lata'
    : termMonths === 60 ? '5 lat'
    : termMonths === 120 ? '10 lat'
    : `${termMonths} mies.`;

  return {
    productName: name,
    productId: type,
    productType: type,
    termMonths,
    termLabel,
    invested: amount,
    grossReturn: balance,
    tax,
    netReturn: amount + netProfit,
    netProfit,
    effectiveAnnualRate,
    realReturn: amount + netProfit - inflationTotal,
    yearlyBreakdown,
    typeLabel: type === 'deposit' ? 'Lokata' : 'Konto oszczędnościowe',
    description: type === 'deposit' 
      ? 'Pieniądze zamrożone na określony czas. Oprocentowanie znane z góry.'
      : 'Pieniądze dostępne w każdej chwili. Oprocentowanie może się zmieniać.',
    prosText: type === 'deposit'
      ? 'Gwarancja BFG do 100 tys. EUR, pewny zysk, prostota'
      : 'Pełna dostępność pieniędzy, gwarancja BFG, prostota',
    consText: type === 'deposit'
      ? 'Pieniądze zamrożone, przy zerwaniu tracisz odsetki, nie chroni przed inflacją'
      : 'Niższe oprocentowanie, bank może zmienić stawkę w dowolnym momencie',
    earlyRedemptionFee: 0,
  };
}

function emptyResult(
  name: string, id: string, type: 'bond' | 'deposit' | 'savings',
  termMonths: number, termLabel: string, amount: number,
  typeLabel: string, description: string, prosText: string, consText: string,
): CalculationResult {
  return {
    productName: name, productId: id, productType: type,
    termMonths, termLabel, invested: amount,
    grossReturn: amount, tax: 0, netReturn: amount, netProfit: 0,
    effectiveAnnualRate: 0, realReturn: amount,
    yearlyBreakdown: [], typeLabel, description, prosText, consText,
    earlyRedemptionFee: 0,
  };
}

/**
 * Get relevant products for a given time horizon
 */
export function getRelevantProducts(
  amount: number,
  termMonths: number,
  expectedInflation: number,
  depositRate: number,
  savingsRate: number,
  includeFamily: boolean = false,
  priority: 'certainty' | 'inflation_protection' | 'balanced' = 'balanced',
): CalculationResult[] {
  const results: CalculationResult[] = [];

  // Always add savings account (available anytime)
  results.push(calculateDeposit(amount, savingsRate, termMonths, expectedInflation, 'Konto oszczędnościowe', 'savings'));

  // Add deposit for the matching term
  results.push(calculateDeposit(amount, depositRate, termMonths, expectedInflation, 'Lokata bankowa', 'deposit'));

  // Add matching bonds
  const allBonds = includeFamily ? [...BOND_TYPES, ...FAMILY_BONDS] : BOND_TYPES;
  
  for (const bond of allBonds) {
    if (bond.termMonths <= termMonths + 6) { // Show bonds that fit within the horizon (with small buffer)
      results.push(calculateBond(bond, amount, expectedInflation));
    }
  }

  // Sort by net profit descending (primary)
  results.sort((a, b) => b.netProfit - a.netProfit);

  return results;
}

/**
 * Generate a human-readable insight about the comparison results
 */
export function generateInsight(
  results: CalculationResult[],
  amount: number,
  termMonths: number,
  expectedInflation: number,
  priority: 'certainty' | 'inflation_protection' | 'balanced',
): { headline: string; detail: string; tone: 'positive' | 'neutral' | 'warning' } {
  if (results.length === 0) return { headline: '', detail: '', tone: 'neutral' };

  const best = results[0];
  const deposit = results.find(r => r.productType === 'deposit');
  const savings = results.find(r => r.productType === 'savings');
  const bestBond = results.find(r => r.productType === 'bond');
  const termYears = termMonths / 12;

  // Check if deposit beats all bonds
  const depositBeatsAllBonds = deposit && bestBond && deposit.netProfit > bestBond.netProfit;
  
  // Check if nothing beats inflation
  const nothingBeatsInflation = results.every(r => r.realReturn < r.invested);

  if (nothingBeatsInflation) {
    return {
      headline: 'Przy tych założeniach żadna opcja nie pokrywa inflacji',
      detail: `Przy inflacji ${expectedInflation}% żadna z dostępnych opcji nie ochroni w pełni Twoich pieniędzy. To nie znaczy, że nie warto oszczędzać - każda opcja jest lepsza niż trzymanie gotówki.`,
      tone: 'warning',
    };
  }

  if (depositBeatsAllBonds && deposit) {
    return {
      headline: 'W tym scenariuszu lokata wygrywa z obligacjami',
      detail: `Przy ${termYears <= 1 ? 'tak krótkim terminie' : 'tych założeniach'} lokata na ${deposit.effectiveAnnualRate.toFixed(1)}% daje lepszy wynik niż dostępne obligacje. Obligacje mają sens przy dłuższym horyzoncie lub wyższej inflacji.`,
      tone: 'neutral',
    };
  }

  if (best.productType === 'bond') {
    const diff = bestBond && deposit ? bestBond.netProfit - deposit.netProfit : 0;
    if (diff > 0 && deposit) {
      return {
        headline: `${best.productId} daje ${formatPLN(diff)} więcej niż lokata`,
        detail: best.typeLabel.includes('inflacj')
          ? `Obligacje indeksowane inflacją automatycznie dostosowują oprocentowanie. Przy inflacji ${expectedInflation}% to przewaga nad lokatą ze stałą stawką.`
          : `Obligacje ${best.productId} ze stałym oprocentowaniem ${best.productId === 'TOS' ? 'i kapitalizacją ' : ''}dają lepszy wynik niż lokata w tym scenariuszu.`,
        tone: 'positive',
      };
    }
  }

  return {
    headline: `Najlepsza opcja: ${best.productName}`,
    detail: `Przy kwocie ${formatPLN(amount)} na ${termYears <= 1 ? `${termMonths} mies.` : `${termYears} lat`} ta opcja daje najwyższy zysk netto po podatku.`,
    tone: 'positive',
  };
}

/**
 * Format PLN amount
 */
export function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPLNExact(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
