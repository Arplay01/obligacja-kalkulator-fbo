const BELKA_TAX_RATE = 0.19;
const DEFAULT_NBP_RATE = 3.75;
const MIN_AMOUNT = 100;
const SLIDER_AMOUNT_MAX = 500000;
const SLIDER_MAX = 1000;
const SLIDER_FINE_BREAK = 600;
const SLIDER_MID_BREAK = 850;
const FINE_RANGE_MAX = 100000;
const MID_RANGE_MAX = 250000;

const moneyFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("pl-PL");

const percentFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const BONDS = {
  OTS: {
    id: "OTS",
    name: "OTS",
    title: "OTS - 3-miesięczne",
    pickerLabel: "3-miesięczne",
    summaryLabel: "3-miesięczne",
    termMonths: 3,
    termLabel: "3 miesiące",
    badgeKind: "fixed",
    badgeLabel: "Stałe oprocentowanie",
    firstRate: 2.5,
    margin: 0,
    capitalization: false,
    payout: "at_maturity",
    introMonths: 3,
    description: () =>
      "Stałe 2,50% przez 3 miesiące. Na końcu odzyskujesz kapitał i odsetki.",
    howItWorks: () =>
      "To najprostsza seria w ofercie: kupujesz na 3 miesiące i z góry wiesz, ile odda na koniec. Nie ma tu ani inflacji, ani stopy NBP w mechanice oprocentowania.",
    pros: [
      "Najkrótszy termin w całej ofercie",
      "Zysk znasz już w dniu zakupu",
      "Brak opłaty za wcześniejszy wykup",
    ],
    cons: [
      "Najniższe oprocentowanie ze wszystkich serii",
      "To raczej parking niż dłuższe oszczędzanie",
      "Inflacja łatwo zjada realny wynik",
    ],
  },
  ROR: {
    id: "ROR",
    name: "ROR",
    title: "ROR - roczne",
    pickerLabel: "roczne",
    summaryLabel: "roczne",
    termMonths: 12,
    termLabel: "1 rok",
    badgeKind: "variable",
    badgeLabel: "Zmienne oprocentowanie",
    firstRate: 4.25,
    margin: 0,
    capitalization: false,
    payout: "monthly",
    introMonths: 3,
    description: (state) =>
      `Pierwsze 3 miesiące: stałe ${formatPercent(4.25)}. Dalej: stopa NBP ${formatPercent(
        state.nbpRate,
      )}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (state) =>
      `Przez pierwsze 3 miesiące ROR ma stałe oprocentowanie ${formatPercent(
        4.25,
      )}. Potem oprocentowanie przechodzi na stopę referencyjną NBP, czyli w tej symulacji ${formatPercent(
        state.nbpRate,
      )}. Odsetki nie kapitalizują się, tylko co miesiąc wpadają na konto.`,
    pros: [
      "Regularne miesięczne odsetki",
      "Krótki horyzont jak na obligację detaliczną",
      "Szybko reaguje na zmianę stopy NBP",
    ],
    cons: [
      "Po okresie startowym wynik zależy od decyzji RPP",
      "Brak marży ponad stopę NBP",
      "Bez ochrony przed wyższą inflacją",
    ],
  },
  DOR: {
    id: "DOR",
    name: "DOR",
    title: "DOR - 2-letnie",
    pickerLabel: "2-latki",
    summaryLabel: "2-latki",
    termMonths: 24,
    termLabel: "2 lata",
    badgeKind: "variable",
    badgeLabel: "Zmienne oprocentowanie",
    firstRate: 4.4,
    margin: 0.15,
    capitalization: false,
    payout: "monthly",
    introMonths: 3,
    description: (state) =>
      `Pierwsze 3 miesiące: stałe ${formatPercent(4.4)}. Dalej: stopa NBP ${formatPercent(
        state.nbpRate,
      )} + ${formatPercent(0.15)}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (state) =>
      `DOR działa podobnie do ROR, ale trwa 2 lata i po pierwszych 3 miesiącach przechodzi na stopę NBP z marżą ${formatPercent(
        0.15,
      )}. W tej symulacji daje to ${formatPercent(state.nbpRate + 0.15)} w kolejnych okresach. Odsetki są wypłacane co miesiąc.`,
    pros: [
      "Miesięczne odsetki jak w ROR",
      "Lekko wyższa marża ponad stopę NBP",
      "Dłuższy czas na wykorzystanie wyższych stóp",
    ],
    cons: [
      "Wynik nadal zależy od stopy NBP",
      "Dłuższe zamrożenie niż w ROR",
      "Inflacja nie podnosi tu kuponu bezpośrednio",
    ],
  },
  TOS: {
    id: "TOS",
    name: "TOS",
    title: "TOS - 3-letnie",
    pickerLabel: "3-latki",
    summaryLabel: "3-latki",
    termMonths: 36,
    termLabel: "3 lata",
    badgeKind: "fixed",
    badgeLabel: "Stałe oprocentowanie",
    firstRate: 4.65,
    margin: 0,
    capitalization: true,
    payout: "at_maturity",
    introMonths: 36,
    description: () =>
      "Stałe 4,65% przez całe 3 lata. Odsetki kapitalizują się co roku i pracują dalej.",
    howItWorks: () =>
      "TOS przez całe 3 lata trzyma stałe oprocentowanie 4,65%. Odsetki dopisują się po każdym roku, więc w kolejnym roku pracują już także na siebie.",
    pros: [
      "Wynik znasz z góry",
      "Kapitalizacja poprawia efekt końcowy",
      "Bez zależności od inflacji i NBP",
    ],
    cons: [
      "Stała stawka nie reaguje na wzrost cen",
      "Przy wysokiej inflacji realny wynik słabnie",
      "Kapitał pracuje sensownie dopiero przy pełnych 3 latach",
    ],
  },
  COI: {
    id: "COI",
    name: "COI",
    title: "COI - 4-letnie",
    pickerLabel: "4-latki",
    summaryLabel: "4-latki",
    termMonths: 48,
    termLabel: "4 lata",
    badgeKind: "inflation",
    badgeLabel: "Indeksowane inflacją",
    firstRate: 5,
    margin: 1.5,
    capitalization: false,
    payout: "annually",
    introMonths: 12,
    description: (state) =>
      `Pierwszy rok: stałe ${formatPercent(5)}. Od 2. roku: inflacja ${formatPercent(
        getEffectiveInflation(state),
      )} + ${formatPercent(1.5)}. Odsetki wypłacane co roku na konto.`,
    howItWorks: (state) =>
      `W pierwszym roku COI płaci stałe ${formatPercent(
        5,
      )}. Od drugiego roku oprocentowanie liczy się jako inflacja + ${formatPercent(
        1.5,
      )}, czyli w tym scenariuszu ${formatPercent(
        getEffectiveInflation(state) + 1.5,
      )}. Odsetki nie kapitalizują się, tylko raz w roku trafiają na konto.`,
    pros: [
      "Chroni lepiej przy wyższej inflacji",
      "Odsetki co roku trafiają na konto",
      "Stała marża od 2. roku",
    ],
    cons: [
      "Przy niskiej inflacji lokata może wypaść podobnie",
      "Brak kapitalizacji odsetek",
      "Pełny sens widać dopiero po kilku latach",
    ],
  },
  EDO: {
    id: "EDO",
    name: "EDO",
    title: "EDO - 10-letnie",
    pickerLabel: "10-latki",
    summaryLabel: "10-latki",
    termMonths: 120,
    termLabel: "10 lat",
    badgeKind: "inflation",
    badgeLabel: "Indeksowane inflacją",
    firstRate: 5.6,
    margin: 2,
    capitalization: true,
    payout: "at_maturity",
    introMonths: 12,
    description: (state) =>
      `Pierwszy rok: stałe ${formatPercent(5.6)}. Od 2. roku: inflacja ${formatPercent(
        getEffectiveInflation(state),
      )} + ${formatPercent(2)}. Odsetki kapitalizują się co roku.`,
    howItWorks: (state) =>
      `EDO zaczyna od ${formatPercent(5.6)} w pierwszym roku, a potem przechodzi na inflację + ${formatPercent(
        2,
      )}, czyli tutaj ${formatPercent(
        getEffectiveInflation(state) + 2,
      )}. Najważniejsze jest to, że odsetki są kapitalizowane, więc w kolejnych latach pracują już także na siebie.`,
    pros: [
      "Najsilniejsza ochrona przed inflacją z tej szóstki",
      "Kapitalizacja wzmacnia wynik przy długim horyzoncie",
      "Stała marża wyższa niż w COI",
    ],
    cons: [
      "To naprawdę długi termin",
      "Przy krótkim myśleniu może być zbyt sztywna",
      "Pełny efekt widać dopiero po latach",
    ],
  },
};

const state = {
  bondId: "COI",
  amount: 10000,
  inflationMode: "preset",
  inflationPreset: 3.5,
  customInflation: 3.5,
  depositRate: 4.0,
  savingsRate: 4.5,
  nbpRate: DEFAULT_NBP_RATE,
  ike: false,
};

const dom = {
  resultShell: document.querySelector(".result-shell"),
  bondButtons: [...document.querySelectorAll("[data-bond]")],
  amountPresets: [...document.querySelectorAll("[data-amount]")],
  inflationButtons: [...document.querySelectorAll("[data-inflation]")],
  stepButtons: [...document.querySelectorAll("[data-step-target]")],
  amountSlider: document.getElementById("amount-slider"),
  amountSliderWrap: document.querySelector("[data-amount-slider-wrap]"),
  amountDisplay: document.querySelector("[data-amount-display]"),
  bondCount: document.querySelector("[data-bond-count]"),
  inflationPanel: document.querySelector('[data-panel="inflation"]'),
  inflationMode: document.querySelector("[data-inflation-mode]"),
  inflationHelper: document.querySelector("[data-inflation-helper]"),
  ikeToggle: document.getElementById("ike-toggle"),
  ikeHelper: document.querySelector("[data-ike-helper]"),
  portfolioReturnButton: document.querySelector("[data-close-portfolio-layer]"),
  depositRate: document.getElementById("deposit-rate"),
  savingsRate: document.getElementById("savings-rate"),
  nbpRate: document.getElementById("nbp-rate"),
  nbpRow: document.querySelector('[data-row="nbp"]'),
  customInflation: document.getElementById("custom-inflation"),
  bondName: document.querySelector("[data-bond-name]"),
  bondDescription: document.querySelector("[data-bond-description]"),
  bondBadge: document.querySelector("[data-bond-badge]"),
  heroTooltip: document.querySelector("[data-hero-tooltip]"),
  inactionText: document.querySelector("[data-inaction-text]"),
  insightBanner: document.querySelector(".insight-banner"),
  insightTitle: document.querySelector("[data-insight-title]"),
  insightText: document.querySelector("[data-insight-text]"),
  depositTitle: document.querySelector("[data-deposit-title]"),
  depositVs: document.querySelector("[data-deposit-vs]"),
  savingsTitle: document.querySelector("[data-savings-title]"),
  savingsVs: document.querySelector("[data-savings-vs]"),
  compareHelper: document.querySelector("[data-compare-helper]"),
  howSummary: document.querySelector("[data-how-summary]"),
  howDescription: document.querySelector("[data-how-description]"),
  prosList: document.querySelector("[data-pros-list]"),
  consList: document.querySelector("[data-cons-list]"),
  chartCopy: document.querySelector("[data-chart-copy]"),
  yearTableBody: document.querySelector("[data-year-table-body]"),
  tableHelper: document.querySelector("[data-table-helper]"),
  numeric: {
    netProfit: document.querySelector('[data-value="netProfit"]'),
    netReturn: document.querySelector('[data-value="netReturn"]'),
    avgProfitPerYear: document.querySelector('[data-value="avgProfitPerYear"]'),
    invested: document.querySelector('[data-value="invested"]'),
    grossInterest: document.querySelector('[data-value="grossInterest"]'),
    tax: document.querySelector('[data-value="tax"]'),
    effectiveAnnualRate: document.querySelector(
      '[data-value="effectiveAnnualRate"]',
    ),
    depositProfit: document.querySelector('[data-value="depositProfit"]'),
    depositTotal: document.querySelector('[data-value="depositTotal"]'),
    savingsProfit: document.querySelector('[data-value="savingsProfit"]'),
    savingsTotal: document.querySelector('[data-value="savingsTotal"]'),
  },
};

let hasRendered = false;
let updateTimer;

function parseLocaleNumber(value, fallback) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatInputNumber(value) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMoney(value, options = {}) {
  const { signed = false } = options;
  const absValue = moneyFormatter.format(Math.abs(value));
  let prefix = "";

  if (signed) {
    prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  } else if (value < 0) {
    prefix = "-";
  }

  return `${prefix}${absValue} zł`;
}

function formatMoneyRounded(value, options = {}) {
  const { signed = false } = options;
  const absValue = integerFormatter.format(Math.round(Math.abs(value)));
  let prefix = "";

  if (signed) {
    prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  } else if (value < 0) {
    prefix = "-";
  }

  return `${prefix}${absValue} zł`;
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function steppedValue(value, delta, min = 0) {
  return Math.max(min, Math.round((value + delta) * 10) / 10);
}

function normaliseAmount(value) {
  const safeValue = Math.max(MIN_AMOUNT, value);
  return Math.round(safeValue / 100) * 100;
}

function parseAmountInput(value, fallback) {
  const digitsOnly = value.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return fallback;
  }

  return normaliseAmount(Number.parseInt(digitsOnly, 10));
}

function formatBondCount(count) {
  if (count === 1) return "1 obligacja po 100 zł";
  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 10 || count % 100 >= 20)
  ) {
    return `${integerFormatter.format(count)} obligacje po 100 zł`;
  }

  return `${integerFormatter.format(count)} obligacji po 100 zł`;
}

function amountToSliderValue(amount) {
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

function sliderValueToAmount(sliderValue) {
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

function inflationFactor(inflation, years) {
  return Math.pow(1 + inflation / 100, years);
}

function getEffectiveInflation(currentState) {
  return currentState.inflationMode === "custom"
    ? currentState.customInflation
    : currentState.inflationPreset;
}

function badgeMarkup(kind, label) {
  const icons = {
    fixed: `
      <span class="results__badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.8" />
          <path d="M9 11V8.5a3 3 0 1 1 6 0V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>
    `,
    variable: `
      <span class="results__badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 16.5 10 11l3 3L19.5 7.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.5 7.5h4v4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    `,
    inflation: `
      <span class="results__badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3.5 6.75 5.75v5.15c0 3.34 2.09 6.35 5.25 7.6 3.16-1.25 5.25-4.26 5.25-7.6V5.75L12 3.5Z" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round" />
          <path d="M9.5 12.5 11 11l1.5 1.5L15 10" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    `,
  };

  return `${icons[kind] || ""}<span>${label}</span>`;
}

function calculateBond(bond, amount, inflation, nbpRate, useIke) {
  const invested = normaliseAmount(amount);
  const termYears = bond.termMonths / 12;
  const breakdown = [];
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
      const interestBase = bond.capitalization
        ? runningDisplayBalance
        : invested;
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

function calculateBenchmark(amount, annualRate, termMonths, inflation) {
  const invested = normaliseAmount(amount);
  const termYears = termMonths / 12;
  const breakdown = [];
  let totalInterest = 0;
  let grossBalance = invested;

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
    const interest = grossBalance * (annualRate / 100);
    grossBalance += interest;
    totalInterest += interest;
    const taxToDate = totalInterest * BELKA_TAX_RATE;
    const netBalance = invested + totalInterest - taxToDate;

    breakdown.push({
      label: `${year}`,
      rateLabel: formatPercent(annualRate),
      interest,
      netBalance,
      realValue: netBalance / inflationFactor(inflation, year),
    });
  }

  const tax = totalInterest * BELKA_TAX_RATE;
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
    breakdown,
  };
}

function setActiveState(elements, matcher, attributeName) {
  elements.forEach((element) => {
    const isActive = matcher(element);
    if (element.classList.contains("chip")) {
      element.classList.toggle("chip--active", isActive);
    }

    if (element.classList.contains("bond-chip")) {
      element.classList.toggle("bond-chip--active", isActive);
    }

    if (attributeName) {
      element.setAttribute(attributeName, String(isActive));
    } else if (element.hasAttribute("aria-pressed")) {
      element.setAttribute("aria-pressed", String(isActive));
    }
  });
}

function animateValue(element, nextValue, formatter) {
  if (!element) return;

  const currentValue = Number.parseFloat(
    element.dataset.currentValue ?? nextValue,
  );

  if (!hasRendered) {
    element.textContent = formatter(nextValue);
    element.dataset.currentValue = String(nextValue);
    return;
  }

  if (Math.abs(currentValue - nextValue) < 0.0001) {
    element.textContent = formatter(nextValue);
    element.dataset.currentValue = String(nextValue);
    return;
  }

  if (element._valueAnimationFrame) {
    cancelAnimationFrame(element._valueAnimationFrame);
  }

  const startTime = performance.now();
  const duration = 320;

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = currentValue + (nextValue - currentValue) * eased;
    element.textContent = formatter(value);

    if (progress < 1) {
      element._valueAnimationFrame = requestAnimationFrame(tick);
      return;
    }

    element.dataset.currentValue = String(nextValue);
    element.textContent = formatter(nextValue);
    element._valueAnimationFrame = null;
  };

  element._valueAnimationFrame = requestAnimationFrame(tick);
}

function updateResultShellAnimation() {
  if (!dom.resultShell || !hasRendered) return;
  dom.resultShell.classList.add("is-updating");
  window.clearTimeout(updateTimer);
  updateTimer = window.setTimeout(() => {
    dom.resultShell.classList.remove("is-updating");
  }, 260);
}

function renderTableRows(rows) {
  dom.yearTableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${row.rateLabel}</td>
          <td>${formatMoney(row.interest)}</td>
          <td>${formatMoney(row.netBalance)}</td>
          <td class="value--positive">${formatMoney(row.realValue)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderList(element, items) {
  element.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function buildInsight(bond, bondResult, depositResult, inflation, nbpRate) {
  const depositDelta = bondResult.netProfit - depositResult.netProfit;

  if (depositDelta < -1) {
    return {
      title: "W tym ustawieniu lokata wypada lepiej",
      text: `Przy ${bond.termLabel.toLowerCase()} lokata na ${formatPercent(
        state.depositRate,
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
      text: `Po pierwszych 3 miesiącach liczę kupon jako ${formatPercent(
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

function renderCompareDelta(element, label, compareTo, delta) {
  const bondWins = delta >= 0;
  element.classList.toggle("compare-card__vs--positive", bondWins);
  element.classList.toggle("compare-card__vs--negative", !bondWins);
  element.innerHTML = bondWins
    ? `${label} daje <strong>${formatMoneyRounded(delta)}</strong> więcej niż ${compareTo}`
    : `${compareTo} daje <strong>${formatMoneyRounded(Math.abs(delta))}</strong> więcej niż ${label}`;
}

function render() {
  const bond = BONDS[state.bondId];
  const effectiveInflation = getEffectiveInflation(state);
  const bondResult = calculateBond(
    bond,
    state.amount,
    effectiveInflation,
    state.nbpRate,
    state.ike,
  );
  const depositResult = calculateBenchmark(
    state.amount,
    state.depositRate,
    bond.termMonths,
    effectiveInflation,
  );
  const savingsResult = calculateBenchmark(
    state.amount,
    state.savingsRate,
    bond.termMonths,
    effectiveInflation,
  );
  const insight = buildInsight(
    bond,
    bondResult,
    depositResult,
    effectiveInflation,
    state.nbpRate,
  );
  const showInflationPanel = true;
  const showNbpRow = bond.badgeKind === "variable";
  const sliderValue = amountToSliderValue(state.amount);
  const sliderFill = (sliderValue / SLIDER_MAX) * 100;

  updateResultShellAnimation();

  dom.bondButtons.forEach((button) => {
    const currentBond = BONDS[button.dataset.bond];
    const rateNode = button.querySelector(".bond-chip__rate");
    const labelNode = button.querySelector(".bond-chip__label");

    if (rateNode) {
      rateNode.textContent = formatPercent(currentBond.firstRate);
    }

    if (labelNode) {
      labelNode.textContent = currentBond.pickerLabel;
    }
  });

  setActiveState(
    dom.bondButtons,
    (button) => button.dataset.bond === state.bondId,
    "aria-selected",
  );
  setActiveState(
    dom.amountPresets,
    (button) => Number.parseInt(button.dataset.amount, 10) === state.amount,
    "aria-pressed",
  );

  const activeInflation = effectiveInflation;
  dom.inflationButtons.forEach((button) => {
    const buttonValue = Number.parseFloat(button.dataset.inflation);
    const isActive = Math.abs(buttonValue - activeInflation) < 0.001;
    button.classList.toggle("chip--active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });

  dom.amountSlider.value = String(sliderValue);
  dom.amountSliderWrap.style.setProperty(
    "--slider-fill",
    `${sliderFill.toFixed(2)}%`,
  );
  if (document.activeElement !== dom.amountDisplay) {
    dom.amountDisplay.value = integerFormatter.format(state.amount);
  }
  dom.bondCount.textContent = formatBondCount(bondResult.invested / 100);

  dom.inflationPanel.classList.toggle("is-hidden", !showInflationPanel);
  dom.nbpRow.classList.toggle("is-hidden", !showNbpRow);

  dom.ikeToggle.setAttribute("aria-checked", String(state.ike));
  dom.ikeHelper.textContent = `Bez podatku od zysków. Tutaj oszczędzasz ok. ${formatMoneyRounded(
    bondResult.totalInterest * BELKA_TAX_RATE,
  )}.`;
  dom.depositRate.value = formatInputNumber(state.depositRate);
  dom.savingsRate.value = formatInputNumber(state.savingsRate);
  dom.nbpRate.value = formatInputNumber(state.nbpRate);
  if (document.activeElement !== dom.customInflation) {
    dom.customInflation.value = formatInputNumber(state.customInflation);
  }

  dom.inflationMode.textContent =
    bond.badgeKind === "inflation"
      ? `Pierwszy rok: stałe ${formatPercent(bond.firstRate)}. Potem: oprocentowanie podąża za inflacją.`
      : state.inflationMode === "custom"
        ? `Aktywna własna inflacja: ${formatPercent(effectiveInflation)}`
        : "Zmienia tylko wynik realny";

  dom.inflationHelper.textContent =
    bond.badgeKind === "inflation"
      ? `Dla ${bond.name} ta wartość zmienia oprocentowanie od 2. roku.`
      : `Dla ${bond.name} inflacja nie zmienia kuponu, ale zmienia realną wartość wyniku.`;

  dom.bondName.textContent = bond.title;
  dom.bondDescription.textContent = bond.description(state);
  dom.bondBadge.className = `results__badge results__badge--${bond.badgeKind}`;
  dom.bondBadge.innerHTML = badgeMarkup(bond.badgeKind, bond.badgeLabel);
  dom.heroTooltip.textContent = `Szacunkowy wynik po podatku Belki (19%), przy założonej inflacji ${formatPercent(
    effectiveInflation,
  )}. Rzeczywisty zysk zależy od przyszłej inflacji.`;

  animateValue(dom.numeric.netProfit, bondResult.netProfit, (value) =>
    formatMoney(value, { signed: true }),
  );
  animateValue(dom.numeric.netReturn, bondResult.netReturn, (value) =>
    formatMoney(value),
  );
  animateValue(
    dom.numeric.avgProfitPerYear,
    bondResult.netProfit / bondResult.termYears,
    (value) => `${formatMoney(value)} / rok`,
  );
  animateValue(dom.numeric.invested, bondResult.invested, (value) =>
    formatMoney(value),
  );
  animateValue(dom.numeric.grossInterest, bondResult.totalInterest, (value) =>
    formatMoney(value),
  );
  animateValue(dom.numeric.tax, bondResult.tax, (value) =>
    formatMoney(-Math.abs(value)),
  );
  animateValue(
    dom.numeric.effectiveAnnualRate,
    bondResult.effectiveAnnualRate,
    (value) => `${formatPercent(value)} netto`,
  );
  animateValue(dom.numeric.depositProfit, depositResult.netProfit, (value) =>
    formatMoney(value, { signed: true }),
  );
  animateValue(
    dom.numeric.depositTotal,
    depositResult.netReturn,
    (value) => `Łącznie: ${formatMoney(value)}`,
  );
  animateValue(dom.numeric.savingsProfit, savingsResult.netProfit, (value) =>
    formatMoney(value, { signed: true }),
  );
  animateValue(
    dom.numeric.savingsTotal,
    savingsResult.netReturn,
    (value) => `Łącznie: ${formatMoney(value)}`,
  );

  dom.numeric.netProfit.classList.toggle(
    "hero-metric__value--negative",
    bondResult.netProfit < 0,
  );
  dom.numeric.netProfit.classList.toggle(
    "hero-metric__value--positive",
    bondResult.netProfit >= 0,
  );

  const inactionRealValue =
    bondResult.invested /
    inflationFactor(effectiveInflation, bondResult.termYears);
  const inactionLoss = bondResult.invested - inactionRealValue;
  dom.inactionText.innerHTML = `Przy inflacji ${formatPercent(
    effectiveInflation,
  )} rocznie Twoje ${formatMoney(
    bondResult.invested,
  )} za ${bond.termLabel.toLowerCase()} będzie mieć siłę nabywczą ok. <strong class="inaction-box__value">${formatMoney(
    inactionRealValue,
  )}</strong>. To realny spadek wartości o <strong class="inaction-box__loss">${formatMoney(
    inactionLoss,
  )}</strong>, nawet jeśli w portfelu nadal widzisz ${formatMoney(
    bondResult.invested,
  )}.`;

  dom.insightTitle.textContent = insight.title;
  dom.insightText.textContent = insight.text;
  dom.insightBanner.hidden = true;

  dom.depositTitle.textContent = `Lokata (${formatPercent(state.depositRate)})`;
  dom.savingsTitle.textContent = `Konto oszczędnościowe (${formatPercent(state.savingsRate)})`;
  renderCompareDelta(
    dom.depositVs,
    bond.name,
    "lokata",
    bondResult.netProfit - depositResult.netProfit,
  );
  renderCompareDelta(
    dom.savingsVs,
    bond.name,
    "konto",
    bondResult.netProfit - savingsResult.netProfit,
  );
  dom.compareHelper.textContent = `Lokata i konto są liczone dla tego samego horyzontu co ${bond.name}.`;

  dom.howSummary.textContent = `Jak działa ${bond.name} - ${bond.summaryLabel}?`;
  dom.howDescription.textContent = bond.howItWorks(state);
  renderList(dom.prosList, bond.pros);
  renderList(dom.consList, bond.cons);
  dom.chartCopy.textContent = `Symulacja dla ${bond.termLabel.toLowerCase()} przy inflacji ${formatPercent(
    effectiveInflation,
  )}`;
  renderTableRows(bondResult.breakdown);
  dom.tableHelper.textContent = `Wartość realna pokazuje, ile ten wynik jest wart po uwzględnieniu inflacji ${formatPercent(
    effectiveInflation,
  )}.`;

  hasRendered = true;
}

function bindEvents() {
  dom.bondButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.bondId = button.dataset.bond;
      render();
    });
  });

  dom.amountSlider.addEventListener("input", (event) => {
    state.amount = sliderValueToAmount(Number.parseInt(event.target.value, 10));
    render();
  });

  dom.amountDisplay.addEventListener("input", () => {
    state.amount = parseAmountInput(dom.amountDisplay.value, state.amount);
    render();
  });

  dom.amountDisplay.addEventListener("blur", () => {
    dom.amountDisplay.value = integerFormatter.format(state.amount);
  });

  dom.amountPresets.forEach((button) => {
    button.addEventListener("click", () => {
      state.amount = Number.parseInt(button.dataset.amount, 10);
      render();
    });
  });

  dom.inflationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.inflationMode = "preset";
      state.inflationPreset = Number.parseFloat(button.dataset.inflation);
      state.customInflation = state.inflationPreset;
      render();
    });
  });

  dom.ikeToggle.addEventListener("click", () => {
    state.ike = !state.ike;
    render();
  });

  [
    [dom.depositRate, "depositRate"],
    [dom.savingsRate, "savingsRate"],
    [dom.nbpRate, "nbpRate"],
  ].forEach(([input, key]) => {
    input.addEventListener("input", () => {
      state[key] = parseLocaleNumber(input.value, state[key]);
      render();
    });

    input.addEventListener("blur", () => {
      input.value = formatInputNumber(state[key]);
    });
  });

  dom.customInflation.addEventListener("input", () => {
    state.customInflation = parseLocaleNumber(
      dom.customInflation.value,
      state.customInflation,
    );
    state.inflationMode = "custom";
    render();
  });

  dom.customInflation.addEventListener("blur", () => {
    dom.customInflation.value = formatInputNumber(state.customInflation);
  });

  dom.stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.stepTarget;
      const delta = Number.parseFloat(button.dataset.step);

      if (target === "deposit-rate") {
        state.depositRate = steppedValue(state.depositRate, delta);
      }

      if (target === "savings-rate") {
        state.savingsRate = steppedValue(state.savingsRate, delta);
      }

      if (target === "nbp-rate") {
        state.nbpRate = steppedValue(state.nbpRate, delta);
      }

      if (target === "custom-inflation") {
        state.customInflation = steppedValue(state.customInflation, delta);
        state.inflationMode = "custom";
      }

      render();
    });
  });

  if (dom.portfolioReturnButton) {
    dom.portfolioReturnButton.addEventListener("click", () => {
      const fallbackUrl =
        dom.portfolioReturnButton.dataset.portfolioFallbackUrl;

      // Future Next.js rewrite: keep this close-intent bridge, so the CTA closes the calculator layer in-place.
      // Standalone prototype still falls back to the portfolio calculator section when nothing handles the event.
      const closeIntent = new CustomEvent("fbo:close-calculator-layer", {
        bubbles: true,
        cancelable: true,
        detail: {
          source: "portfolio-cta",
          fallbackUrl,
        },
      });

      const handledInPage =
        !dom.portfolioReturnButton.dispatchEvent(closeIntent);

      if (handledInPage) {
        return;
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "fbo:close-calculator-layer",
            source: "portfolio-cta",
            fallbackUrl,
          },
          "*",
        );
        return;
      }

      window.location.href = fallbackUrl;
    });
  }
}

bindEvents();
render();
