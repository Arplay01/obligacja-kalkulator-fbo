import type {
  BondCopyContext,
  BondId,
  BondDefinition,
} from "@/features/calculator/domain/types";
import { CURRENT_RETAIL_BOND_OFFER } from "@/features/calculator/lib/current-bond-offer";
import { formatPercent } from "@/features/calculator/lib/formatters";

function inflation(context: BondCopyContext) {
  return context.effectiveInflation;
}

const OTS_OFFER = CURRENT_RETAIL_BOND_OFFER.OTS;
const ROR_OFFER = CURRENT_RETAIL_BOND_OFFER.ROR;
const DOR_OFFER = CURRENT_RETAIL_BOND_OFFER.DOR;
const TOS_OFFER = CURRENT_RETAIL_BOND_OFFER.TOS;
const COI_OFFER = CURRENT_RETAIL_BOND_OFFER.COI;
const EDO_OFFER = CURRENT_RETAIL_BOND_OFFER.EDO;

export const BONDS: Record<BondId, BondDefinition> = {
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
    chipBadgeLabel: "Stałe",
    firstRate: OTS_OFFER.firstRate,
    margin: OTS_OFFER.margin,
    capitalization: false,
    payout: "at_maturity",
    introMonths: OTS_OFFER.introMonths,
    description: () =>
      `Stałe ${formatPercent(OTS_OFFER.firstRate)} przez 3 miesiące. Na końcu odzyskujesz kapitał i odsetki.`,
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
    chipBadgeLabel: "Zmienne",
    firstRate: ROR_OFFER.firstRate,
    margin: ROR_OFFER.margin,
    capitalization: false,
    payout: "monthly",
    introMonths: ROR_OFFER.introMonths,
    description: (context) =>
      `Pierwszy miesiąc: stałe ${formatPercent(ROR_OFFER.firstRate)}. Dalej: stopa NBP ${formatPercent(
        context.nbpRate,
      )}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (context) =>
      `Przez pierwszy miesiąc ROR ma stałe oprocentowanie ${formatPercent(
        ROR_OFFER.firstRate,
      )}. Potem oprocentowanie przechodzi na stopę referencyjną NBP, co w tej symulacji daje ${formatPercent(
        context.nbpRate,
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
    chipBadgeLabel: "Zmienne",
    firstRate: DOR_OFFER.firstRate,
    margin: DOR_OFFER.margin,
    capitalization: false,
    payout: "monthly",
    introMonths: DOR_OFFER.introMonths,
    description: (context) =>
      `Pierwszy miesiąc: stałe ${formatPercent(DOR_OFFER.firstRate)}. Dalej: stopa NBP ${formatPercent(
        context.nbpRate,
      )} + ${formatPercent(DOR_OFFER.margin)}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (context) =>
      `DOR działa podobnie do ROR, ale trwa 2 lata i po pierwszym miesiącu przechodzi na stopę NBP z marżą ${formatPercent(
        DOR_OFFER.margin,
      )}. W tej symulacji daje to ${formatPercent(context.nbpRate + DOR_OFFER.margin)} w kolejnych okresach. Odsetki są wypłacane co miesiąc.`,
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
    chipBadgeLabel: "Stałe",
    firstRate: TOS_OFFER.firstRate,
    margin: TOS_OFFER.margin,
    capitalization: true,
    payout: "at_maturity",
    introMonths: TOS_OFFER.introMonths,
    description: () =>
      `Stałe ${formatPercent(TOS_OFFER.firstRate)} przez całe 3 lata. Odsetki kapitalizują się co roku i pracują dalej.`,
    howItWorks: () =>
      `TOS przez całe 3 lata trzyma stałe oprocentowanie ${formatPercent(TOS_OFFER.firstRate)}. Odsetki dopisują się po każdym roku, więc w kolejnym roku pracują już także na siebie.`,
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
    chipBadgeLabel: "Inflacja",
    firstRate: COI_OFFER.firstRate,
    margin: COI_OFFER.margin,
    capitalization: false,
    payout: "annually",
    introMonths: COI_OFFER.introMonths,
    description: (context) =>
      `Pierwszy rok: stałe ${formatPercent(COI_OFFER.firstRate)}. Od 2. roku: inflacja ${formatPercent(
        inflation(context),
      )} + marża ${formatPercent(COI_OFFER.margin)}. Odsetki wypłacane co roku na konto.`,
    howItWorks: (context) =>
      `W pierwszym roku COI płaci stałe ${formatPercent(
        COI_OFFER.firstRate,
      )}. Od drugiego roku oprocentowanie liczy się jako inflacja + marża ${formatPercent(
        COI_OFFER.margin,
      )}, czyli w tym scenariuszu ${formatPercent(
        inflation(context) + COI_OFFER.margin,
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
    chipBadgeLabel: "Inflacja",
    firstRate: EDO_OFFER.firstRate,
    margin: EDO_OFFER.margin,
    capitalization: true,
    payout: "at_maturity",
    introMonths: EDO_OFFER.introMonths,
    description: (context) =>
      `1. rok: stałe ${formatPercent(EDO_OFFER.firstRate)}. Od 2. roku: inflacja ${formatPercent(
        inflation(context),
      )} + ${formatPercent(EDO_OFFER.margin)} marży. Odsetki kapitalizują się co roku i pracują dalej.`,
    howItWorks: (context) =>
      `EDO zaczyna od ${formatPercent(
        EDO_OFFER.firstRate,
      )} w pierwszym roku, a potem przechodzi na inflację + marżę ${formatPercent(
        EDO_OFFER.margin,
      )}, co w tej symulacji daje ${formatPercent(
        inflation(context) + EDO_OFFER.margin,
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
