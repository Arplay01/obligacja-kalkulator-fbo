import Link from "next/link";
import { BookIcon, FileIcon } from "@/features/calculator/components/icons";
import { EXTERNAL_LINKS } from "@/features/calculator/lib/constants";

export function ComparisonNextSteps() {
  return (
    <section className="next-steps comparison-next-steps" aria-label="Następne kroki">
      <h2 className="section-title">Co dalej?</h2>

      <div className="next-steps__grid">
        <a
          className="next-card"
          href={EXTERNAL_LINKS.challenge}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookIcon />
          <p className="next-card__title">7-dniowe wyzwanie</p>
          <p className="next-card__text">
            Jeśli już wiesz, że obligacje mają sens, tu masz prosty następny krok.
          </p>
        </a>

        <a
          className="next-card"
          href={EXTERNAL_LINKS.excel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileIcon />
          <p className="next-card__title">Excel dla zaawansowanych</p>
          <p className="next-card__text">
            Więcej parametrów, więcej scenariuszy i pełna warstwa ekspercka.
          </p>
        </a>

        <Link
          className="next-card next-card--portfolio comparison-next-steps__return"
          href="/kalkulator"
          data-back-to-calculator
        >
          <span className="next-card__content">
            <span className="next-card__title">Wróć do prostego kalkulatora</span>
            <span className="next-card__text">
              Gdy chcesz policzyć jedną konkretną serię w spokojniejszym,
              prostszym widoku.
            </span>
          </span>
          <span className="next-card__cta" aria-hidden="true">
            Otwórz /kalkulator
          </span>
        </Link>
      </div>
    </section>
  );
}
