import { InflationIcon } from "@/features/calculator/components/icons";
import {
  CURRENT_BOND_OFFER_MONTH_LABEL,
  CURRENT_NBP_REFERENCE_RATE,
} from "@/features/calculator/lib/current-bond-offer";
import { formatPercent } from "@/features/calculator/lib/formatters";

export function CalculatorTrustFooter() {
  return (
    <footer className="trust-footer" aria-label="Informacje prawne i uproszczenia">
      <div className="trust-footer__top">
        <InflationIcon className="trust-footer__icon" />

        <div className="trust-footer__copy">
          <p className="trust-footer__disclaimer">
            To narzędzie ma charakter edukacyjny i nie stanowi porady inwestycyjnej.
            Wynik zależy od przyjętej inflacji, aktualnych parametrów emisji i
            uproszczeń modelu.
          </p>
          <p className="trust-footer__source">
            Stawki w prototypie: oferta detalicznych obligacji Skarbu Państwa na{" "}
            <strong>{CURRENT_BOND_OFFER_MONTH_LABEL}</strong> oraz stopa referencyjna NBP{" "}
            <strong>{formatPercent(CURRENT_NBP_REFERENCE_RATE)}</strong>.
          </p>
        </div>
      </div>

      <details className="trust-footer__simplifications">
        <summary>Uproszczenia tej symulacji</summary>
        <ul>
          <li>Inflacja jest stała przez cały okres i działa jako scenariusz użytkownika</li>
          <li>
            Lokata i konto to ręcznie ustawiane punkty odniesienia, nie najlepsza
            oferta rynku
          </li>
          <li>Dla COI i ROR/DOR nie uwzględniono reinwestowania wypłacanych odsetek</li>
          <li>Kwota inwestycji jest zaokrąglana do pełnych obligacji po 100 zł</li>
          <li>
            W głównym wyniku nie uwzględniono ceny zamiany 99,90 zł ani
            przedterminowego wykupu
          </li>
        </ul>
      </details>
    </footer>
  );
}
