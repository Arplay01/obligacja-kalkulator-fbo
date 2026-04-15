import type { ComparisonRecommendation } from "@/features/comparison-legacy/domain/types";

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
      <p className="comparison-recommendation__subheadline">
        {recommendation.subheadline}
      </p>
      <p className="comparison-recommendation__body">{recommendation.body}</p>
    </section>
  );
}
