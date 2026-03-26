import type { MouseEvent } from "react";
import { BookIcon, FileIcon } from "@/features/calculator/components/icons";
import {
  EXTERNAL_LINKS,
  PORTFOLIO_FALLBACK_URL,
} from "@/features/calculator/lib/constants";

type CalculatorNextStepsProps = {
  onPortfolioReturn: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function CalculatorNextSteps({
  onPortfolioReturn,
}: CalculatorNextStepsProps) {
  return (
    <section className="next-steps" aria-label="Następne kroki">
      <h2 className="section-title">Więcej materiałów</h2>

      <div className="next-steps__grid">
        <a
          className="next-card"
          href={EXTERNAL_LINKS.education}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookIcon />
          <p className="next-card__title">Dowiedz się więcej o obligacjach</p>
          <p className="next-card__text">
            Szczegółowy artykuł i szerszy kontekst dla bardziej dociekliwych.
          </p>
        </a>

        <a
          className="next-card"
          href={EXTERNAL_LINKS.excel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileIcon />
          <p className="next-card__title">Dla zaawansowanych</p>
          <p className="next-card__text">
            Kalkulator obligacji w Excelu - więcej parametrów i dokładniejsze
            wyliczenia.
          </p>
        </a>

        <button
          type="button"
          className="next-card next-card--portfolio"
          data-close-portfolio-layer
          data-portfolio-fallback-url={PORTFOLIO_FALLBACK_URL}
          onClick={onPortfolioReturn}
        >
          <span className="next-card__content">
            <span className="next-card__title">Wróć do portfolio</span>
            <span className="next-card__text">
              Case study i decyzje produktowe stojące za tym narzędziem.
            </span>
          </span>
          <span className="next-card__cta" aria-hidden="true">
            Zobacz szczegóły
          </span>
        </button>
      </div>
    </section>
  );
}
