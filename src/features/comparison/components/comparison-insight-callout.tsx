import type { ComparisonRecommendation } from "@/features/comparison/domain/types";

type ComparisonRecommendationCardProps = {
  recommendation: ComparisonRecommendation;
};

export function ComparisonRecommendationCard({
  recommendation,
}: ComparisonRecommendationCardProps) {
  return (
    <section
      className="comparison-recommendation"
      aria-label="Rekomendacja"
      data-comparison-recommendation
    >
      <h2 className="comparison-recommendation__headline">
        {recommendation.headline}
      </h2>
      <div className="comparison-recommendation__grid">
        <article className="comparison-recommendation__panel comparison-recommendation__panel--best">
          <p className="comparison-recommendation__label">
            Dlaczego właśnie ta opcja
          </p>
          <p className="comparison-recommendation__body">
            {recommendation.bestBody}
          </p>
        </article>
        <article className="comparison-recommendation__panel comparison-recommendation__panel--inaction">
          <p className="comparison-recommendation__label">
            Jeśli nic nie zrobisz
          </p>
          <p className="comparison-recommendation__body">
            {recommendation.inactionBody}
          </p>
        </article>
        <article className="comparison-recommendation__panel comparison-recommendation__panel--deposit">
          <p className="comparison-recommendation__label">
            {recommendation.depositHeading}
          </p>
          <p className="comparison-recommendation__body">
            {recommendation.depositBody}
          </p>
        </article>
      </div>
    </section>
  );
}
