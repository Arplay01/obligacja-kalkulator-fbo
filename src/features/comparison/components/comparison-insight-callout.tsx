import { InsightIcon } from "@/features/calculator/components/icons";
import type {
  ComparisonInsight,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import { formatMoneyRounded } from "@/features/calculator/lib/formatters";

type ComparisonInsightCalloutProps = {
  insight: ComparisonInsight | null;
  displayMode: ComparisonValueMode;
};

export function ComparisonInsightCallout({
  insight,
  displayMode,
}: ComparisonInsightCalloutProps) {
  if (!insight) {
    return null;
  }

  const delta =
    displayMode === "real" ? insight.deltaReal : insight.deltaNet;
  const absoluteDelta = Math.abs(delta);
  const valueLabel = formatMoneyRounded(absoluteDelta);
  const isEdoLeading = insight.winnerId === "EDO";

  return (
    <div className="insight-banner comparison-insight" data-comparison-insight>
      <InsightIcon className="insight-banner__icon" />
      <div className="insight-banner__copy">
        <p className="insight-banner__title">
          {isEdoLeading
            ? `EDO daje ${valueLabel} więcej niż COI${displayMode === "real" ? " po inflacji" : ""}.`
            : `COI daje ${valueLabel} więcej niż EDO${displayMode === "real" ? " po inflacji" : ""}.`}
        </p>
        <p>
          {isEdoLeading
            ? "W tym układzie najmocniej działa kapitalizacja, wyższa marża w EDO i podatek odsunięty do końca. W COI odsetki wpadają co roku na konto i nie pracują dalej."
            : "Przy tym krótszym lub spokojniejszym układzie przewaga EDO nie zdążyła się jeszcze w pełni rozwinąć. Im dłuższy horyzont, tym mocniej widać efekt kapitalizacji i wyższej marży w EDO."}
        </p>
      </div>
    </div>
  );
}
