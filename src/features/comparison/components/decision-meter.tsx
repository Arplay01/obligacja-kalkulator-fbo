import { formatInteger } from "@/features/calculator/lib/formatters";

type DecisionMeterProps = {
  count: number;
  className?: string;
  maxVisible?: number;
};

export function formatDecisionLabel(count: number) {
  if (count === 1) {
    return "1 decyzja";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${formatInteger(count)} decyzje`;
  }

  return `${formatInteger(count)} decyzji`;
}

export function DecisionMeter({
  count,
  className,
  maxVisible = 12,
}: DecisionMeterProps) {
  const visibleCount = Math.min(count, maxVisible);
  const hiddenCount = Math.max(count - visibleCount, 0);

  return (
    <div
      className={`decision-meter${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: visibleCount }, (_, index) => (
        <span key={index} className="decision-meter__dot" />
      ))}
      {hiddenCount > 0 ? (
        <span className="decision-meter__more">+{formatInteger(hiddenCount)}</span>
      ) : null}
    </div>
  );
}
