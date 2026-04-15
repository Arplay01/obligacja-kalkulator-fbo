import { EXTERNAL_LINKS } from "@/features/calculator/lib/constants";

type ChallengeCtaProps = {
  title: string;
  description: string;
  ariaLabel?: string;
  buttonLabel?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
  label?: string;
};

export function ChallengeCta({
  title,
  description,
  ariaLabel = "Następny krok",
  buttonLabel = "Dołącz do wyzwania",
  className,
  headingLevel = "h3",
  label,
}: ChallengeCtaProps) {
  const HeadingTag = headingLevel;
  const sectionClassName = ["action-cta", className].filter(Boolean).join(" ");

  return (
    <section
      className={sectionClassName}
      aria-label={ariaLabel}
      data-challenge-cta
    >
      {label ? <p className="micro-label">{label}</p> : null}
      <HeadingTag className="action-cta__title">{title}</HeadingTag>
      <p className="action-cta__text">{description}</p>
      <a
        className="action-cta__button"
        href={EXTERNAL_LINKS.challenge}
        target="_blank"
        rel="noopener noreferrer"
        data-challenge-cta-link
      >
        {buttonLabel}
      </a>
    </section>
  );
}
