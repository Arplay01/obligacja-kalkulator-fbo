import type { BreakdownRow } from "@/features/calculator/domain/types";
import { ChartPlaceholderIcon } from "@/features/calculator/components/icons";
import { formatMoneyRounded, formatPercent } from "@/features/calculator/lib/formatters";

type GrowthChartProps = {
  invested: number;
  breakdown: BreakdownRow[];
  effectiveInflation: number;
  termLabel: string;
};

type ChartPoint = {
  label: string;
  netBalance: number;
  realValue: number;
};

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const CHART_PADDING = {
  top: 22,
  right: 28,
  bottom: 44,
  left: 72,
};

function getChartPoints(invested: number, breakdown: BreakdownRow[]): ChartPoint[] {
  return [
    {
      label: "Start",
      netBalance: invested,
      realValue: invested,
    },
    ...breakdown.map((row) => ({
      label: row.label,
      netBalance: row.netBalance,
      realValue: row.realValue,
    })),
  ];
}

function getPolylinePoints(points: ChartPoint[], maxValue: number, key: "netBalance" | "realValue") {
  const innerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return points
    .map((point, index) => {
      const x =
        CHART_PADDING.left +
        (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
      const y =
        CHART_PADDING.top +
        innerHeight -
        (point[key] / maxValue) * innerHeight;

      return { x, y };
    });
}

function buildLinePath(points: { x: number; y: number }[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function buildAreaPath(points: { x: number; y: number }[]) {
  const baselineY = CHART_HEIGHT - CHART_PADDING.bottom;
  const linePath = buildLinePath(points);
  const lastPoint = points.at(-1);
  const firstPoint = points[0];

  if (!lastPoint || !firstPoint) {
    return "";
  }

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

function getYAxisTicks(maxValue: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = maxValue * (1 - ratio);
    const y =
      CHART_PADDING.top +
      (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom) * ratio;

    return {
      value,
      y,
    };
  });
}

export function GrowthChart({
  invested,
  breakdown,
  effectiveInflation,
  termLabel,
}: GrowthChartProps) {
  const points = getChartPoints(invested, breakdown);
  const hasEnoughPointsForChart = points.length >= 3;
  const finalPoint = points.at(-1);
  const fallbackPoint = finalPoint ?? {
    label: "Start",
    netBalance: invested,
    realValue: invested,
  };

  if (!hasEnoughPointsForChart || !finalPoint) {
    return (
      <div className="chart-empty-state" data-chart-empty>
        <div className="chart-empty-state__icon" aria-hidden="true">
          <ChartPlaceholderIcon />
        </div>
        <div className="chart-empty-state__copy">
          <p className="chart-empty-state__title">Za krótka symulacja na wykres liniowy</p>
          <p>
            Dla {termLabel.toLowerCase()} masz tylko jeden punkt końcowy. Dlatego niżej
            pokazuję czytelny wynik końcowy i tabelę zamiast sztucznie rozciągać wykres.
          </p>
        </div>
        <div className="chart-empty-state__stats">
          <div className="chart-stat">
            <span className="chart-stat__label">Start</span>
            <strong>{formatMoneyRounded(invested)}</strong>
          </div>
          <div className="chart-stat">
            <span className="chart-stat__label">Na koniec</span>
            <strong>{formatMoneyRounded(fallbackPoint.netBalance)}</strong>
          </div>
          <div className="chart-stat">
            <span className="chart-stat__label">Po inflacji</span>
            <strong>{formatMoneyRounded(fallbackPoint.realValue)}</strong>
          </div>
        </div>
      </div>
    );
  }

  const chartFinalPoint = finalPoint;
  const maxValue = Math.max(...points.map((point) => point.netBalance), invested) * 1.08;
  const nominalPoints = getPolylinePoints(points, maxValue, "netBalance");
  const realPoints = getPolylinePoints(points, maxValue, "realValue");
  const yAxisTicks = getYAxisTicks(maxValue);
  const nominalPath = buildLinePath(nominalPoints);
  const realPath = buildLinePath(realPoints);
  const areaPath = buildAreaPath(nominalPoints);

  return (
    <figure className="growth-chart" data-growth-chart>
      <div className="growth-chart__header">
        <div>
          <p className="growth-chart__eyebrow">Symulacja rok po roku</p>
          <p className="growth-chart__title">
            {termLabel} przy inflacji {formatPercent(effectiveInflation)}
          </p>
        </div>

        <div className="growth-chart__legend" aria-label="Legenda wykresu">
          <span className="growth-chart__legend-item">
            <span className="growth-chart__swatch growth-chart__swatch--nominal" />
            Łącznie netto
          </span>
          <span className="growth-chart__legend-item">
            <span className="growth-chart__swatch growth-chart__swatch--real" />
            Wartość realna
          </span>
        </div>
      </div>

      <div className="growth-chart__shell">
        <svg
          className="growth-chart__svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={`Wykres dla ${termLabel.toLowerCase()} z dwiema liniami: łącznie netto i wartość realna po inflacji ${formatPercent(effectiveInflation)}.`}
        >
          <path className="growth-chart__area" d={areaPath} />

          {yAxisTicks.map((tick) => (
            <g key={tick.y}>
              <line
                className="growth-chart__grid-line"
                x1={CHART_PADDING.left}
                y1={tick.y}
                x2={CHART_WIDTH - CHART_PADDING.right}
                y2={tick.y}
              />
              <text
                className="growth-chart__axis-label growth-chart__axis-label--y"
                x={CHART_PADDING.left - 12}
                y={tick.y + 4}
                textAnchor="end"
              >
                {formatMoneyRounded(tick.value)}
              </text>
            </g>
          ))}

          {nominalPoints.map((point, index) => (
            <text
              key={`x-${points[index]?.label ?? index}`}
              className="growth-chart__axis-label"
              x={point.x}
              y={CHART_HEIGHT - 14}
              textAnchor="middle"
            >
              {points[index]?.label}
            </text>
          ))}

          <path className="growth-chart__line growth-chart__line--nominal" d={nominalPath} />
          <path className="growth-chart__line growth-chart__line--real" d={realPath} />

          {nominalPoints.map((point, index) => (
            <circle
              key={`nominal-${points[index]?.label ?? index}`}
              className="growth-chart__point growth-chart__point--nominal"
              cx={point.x}
              cy={point.y}
              r={index === nominalPoints.length - 1 ? 5.5 : 4}
            />
          ))}

          {realPoints.map((point, index) => (
            <circle
              key={`real-${points[index]?.label ?? index}`}
              className="growth-chart__point growth-chart__point--real"
              cx={point.x}
              cy={point.y}
              r={index === realPoints.length - 1 ? 5 : 3.5}
            />
          ))}
        </svg>
      </div>

      <div className="growth-chart__footer">
        <div className="chart-stat">
          <span className="chart-stat__label">Start</span>
          <strong>{formatMoneyRounded(invested)}</strong>
        </div>
        <div className="chart-stat">
          <span className="chart-stat__label">Na koniec netto</span>
          <strong>{formatMoneyRounded(chartFinalPoint.netBalance)}</strong>
        </div>
        <div className="chart-stat">
          <span className="chart-stat__label">Po inflacji</span>
          <strong>{formatMoneyRounded(chartFinalPoint.realValue)}</strong>
        </div>
      </div>
    </figure>
  );
}
