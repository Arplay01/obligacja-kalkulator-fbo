import type {
  BondCopyContext,
  BondId,
  BondDefinition,
} from "@/features/calculator/domain/types";
import { formatPercent } from "@/features/calculator/lib/formatters";

function inflation(context: BondCopyContext) {
  return context.effectiveInflation;
}

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
    chipBadgeLabel: "Zmienne",
    firstRate: 4.25,
    margin: 0,
    capitalization: false,
    payout: "monthly",
    introMonths: 3,
    description: (context) =>
      `Pierwsze 3 miesiące: stałe ${formatPercent(4.25)}. Dalej: stopa NBP ${formatPercent(
        context.nbpRate,
      )}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (context) =>
      `Przez pierwsze 3 miesiące ROR ma stałe oprocentowanie ${formatPercent(
        4.25,
      )}. Potem oprocentowanie przechodzi na stopę referencyjną NBP, czyli w tej symulacji ${formatPercent(
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
    firstRate: 4.4,
    margin: 0.15,
    capitalization: false,
    payout: "monthly",
    introMonths: 3,
    description: (context) =>
      `Pierwsze 3 miesiące: stałe ${formatPercent(4.4)}. Dalej: stopa NBP ${formatPercent(
        context.nbpRate,
      )} + ${formatPercent(0.15)}. Odsetki wypłacane co miesiąc.`,
    howItWorks: (context) =>
      `DOR działa podobnie do ROR, ale trwa 2 lata i po pierwszych 3 miesiącach przechodzi na stopę NBP z marżą ${formatPercent(
        0.15,
      )}. W tej symulacji daje to ${formatPercent(context.nbpRate + 0.15)} w kolejnych okresach. Odsetki są wypłacane co miesiąc.`,
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
    chipBadgeLabel: "Inflacja",
    firstRate: 5,
    margin: 1.5,
    capitalization: false,
    payout: "annually",
    introMonths: 12,
    description: (context) =>
      `Pierwszy rok: stałe ${formatPercent(5)}. Od 2. roku: inflacja ${formatPercent(
        inflation(context),
      )} + marża ${formatPercent(1.5)}. Odsetki wypłacane co roku na konto.`,
    howItWorks: (context) =>
      `W pierwszym roku COI płaci stałe ${formatPercent(
        5,
      )}. Od drugiego roku oprocentowanie liczy się jako inflacja + marża ${formatPercent(
        1.5,
      )}, czyli w tym scenariuszu ${formatPercent(
        inflation(context) + 1.5,
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
    firstRate: 5.6,
    margin: 2,
    capitalization: true,
    payout: "at_maturity",
    introMonths: 12,
    description: (context) =>
      `Pierwszy rok: stałe ${formatPercent(5.6)}. Od 2. roku: inflacja ${formatPercent(
        inflation(context),
      )} + marża ${formatPercent(2)}. Odsetki kapitalizują się co roku.`,
    howItWorks: (context) =>
      `EDO zaczyna od ${formatPercent(
        5.6,
      )} w pierwszym roku, a potem przechodzi na inflację + marżę ${formatPercent(
        2,
      )}, czyli tutaj ${formatPercent(
        inflation(context) + 2,
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
