import type { BreakdownRow } from "@/features/calculator/domain/types";
import { ChartPlaceholderIcon } from "@/features/calculator/components/icons";
import { inflationFactor } from "@/features/calculator/lib/calculator";
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
  inflationThreshold: number;
};

type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const CHART_WIDTH = 760;
const CHART_HEIGHT = 280;
const CHART_PADDING: ChartPadding = {
  top: 22,
  right: 28,
  bottom: 44,
  left: 72,
};
const Y_AXIS_LABEL_GAP = 14;
const Y_AXIS_LABEL_CHAR_WIDTH = 7.4;

function getChartPoints(
  invested: number,
  breakdown: BreakdownRow[],
  effectiveInflation: number,
): ChartPoint[] {
  return [
    {
      label: "Start",
      netBalance: invested,
      realValue: invested,
      inflationThreshold: invested,
    },
    ...breakdown.map((row, index) => ({
      label: row.label,
      netBalance: row.netBalance,
      realValue: row.realValue,
      inflationThreshold: invested * inflationFactor(effectiveInflation, index + 1),
    })),
  ];
}

function getPolylinePoints(
  points: ChartPoint[],
  scale: { min: number; max: number },
  chartPadding: ChartPadding,
  key: "netBalance" | "inflationThreshold",
) {
  const innerWidth = CHART_WIDTH - chartPadding.left - chartPadding.right;
  const innerHeight = CHART_HEIGHT - chartPadding.top - chartPadding.bottom;
  const range = Math.max(scale.max - scale.min, 1);

  return points
    .map((point, index) => {
      const x =
        chartPadding.left +
        (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
      const y =
        chartPadding.top +
        innerHeight -
        ((point[key] - scale.min) / range) * innerHeight;

      return { x, y };
    });
}

function buildLinePath(points: { x: number; y: number }[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function buildAreaPath(points: { x: number; y: number }[], chartPadding: ChartPadding) {
  const baselineY = CHART_HEIGHT - chartPadding.bottom;
  const linePath = buildLinePath(points);
  const lastPoint = points.at(-1);
  const firstPoint = points[0];

  if (!lastPoint || !firstPoint) {
    return "";
  }

  return `${linePath} L ${lastPoint.x.toFixed(2)} ${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

function getYAxisTicks(scale: { min: number; max: number }, chartPadding: ChartPadding) {
  const range = Math.max(scale.max - scale.min, 1);

  return Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    const value = scale.min + (1 - ratio) * range;
    const y =
      chartPadding.top +
      (CHART_HEIGHT - chartPadding.top - chartPadding.bottom) * ratio;

    return {
      value,
      y,
    };
  });
}

function getChartPadding(scale: { min: number; max: number }) {
  const labelLengths = getYAxisTicks(scale, CHART_PADDING).map(
    (tick) => formatMoneyRounded(tick.value).length,
  );
  const longestLabelLength = Math.max(...labelLengths, 0);
  const estimatedLabelWidth = longestLabelLength * Y_AXIS_LABEL_CHAR_WIDTH;

  return {
    ...CHART_PADDING,
    // Bugfix: widen the Y-axis gutter for large amounts so labels never clip at the left edge.
    left: Math.max(CHART_PADDING.left, Math.ceil(estimatedLabelWidth + Y_AXIS_LABEL_GAP + 8)),
  };
}

export function GrowthChart({
  invested,
  breakdown,
  effectiveInflation,
  termLabel,
}: GrowthChartProps) {
  const points = getChartPoints(invested, breakdown, effectiveInflation);
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
            Dla {termLabel.toLowerCase()} jest tylko jeden punkt końcowy. Dlatego
            niżej pokazano czytelny wynik końcowy i tabelę zamiast sztucznie
            rozciągać wykres.
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
  const values = points.flatMap((point) => [point.netBalance, point.inflationThreshold]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = Math.max((rawMax - rawMin) * 0.08, invested * 0.01, 1);
  const scale = {
    min: Math.max(0, rawMin - padding),
    max: rawMax + padding,
  };
  const chartPadding = getChartPadding(scale);
  const nominalPoints = getPolylinePoints(points, scale, chartPadding, "netBalance");
  const inflationPoints = getPolylinePoints(
    points,
    scale,
    chartPadding,
    "inflationThreshold",
  );
  const yAxisTicks = getYAxisTicks(scale, chartPadding);
  const nominalPath = buildLinePath(nominalPoints);
  const inflationPath = buildLinePath(inflationPoints);
  const areaPath = buildAreaPath(nominalPoints, chartPadding);

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
            Kwota na koniec
          </span>
          <span className="growth-chart__legend-item">
            <span className="growth-chart__swatch growth-chart__swatch--inflation" />
            Inflacja
          </span>
        </div>
      </div>

      <div className="growth-chart__shell">
        <div className="growth-chart__stage">
          <svg
            className="growth-chart__svg"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-label={`Wykres dla ${termLabel.toLowerCase()} z dwiema liniami: kwotą na koniec po podatku i linią inflacji przy założeniu ${formatPercent(effectiveInflation)} rocznie.`}
          >
            <path className="growth-chart__area" d={areaPath} />

            {yAxisTicks.map((tick) => (
              <g key={tick.y}>
                <line
                  className="growth-chart__grid-line"
                  x1={chartPadding.left}
                  y1={tick.y}
                  x2={CHART_WIDTH - chartPadding.right}
                  y2={tick.y}
                />
                <text
                  className="growth-chart__axis-label growth-chart__axis-label--y"
                  x={chartPadding.left - Y_AXIS_LABEL_GAP}
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

            <path className="growth-chart__line growth-chart__line--inflation" d={inflationPath} />
            <path className="growth-chart__line growth-chart__line--nominal" d={nominalPath} />

            {inflationPoints.map((point, index) => (
              <circle
                key={`inflation-${points[index]?.label ?? index}`}
                className="growth-chart__point growth-chart__point--inflation"
                cx={point.x}
                cy={point.y}
                r={index === inflationPoints.length - 1 ? 4.2 : 2.8}
              />
            ))}

            {nominalPoints.map((point, index) => (
              <circle
                key={`nominal-${points[index]?.label ?? index}`}
                className="growth-chart__point growth-chart__point--nominal"
                cx={point.x}
                cy={point.y}
                r={index === nominalPoints.length - 1 ? 5.5 : 4}
              />
            ))}
          </svg>
        </div>
      </div>

      <p className="helper-text growth-chart__helper" data-chart-helper>
        Kwota na koniec pokazuje, ile możesz mieć po zakończeniu oszczędzania, już po
        podatku. Linia inflacji pokazuje, ile trzeba mieć nominalnie, żeby utrzymać
        dzisiejszą siłę nabywczą.
      </p>

      <div className="growth-chart__footer">
        <div className="chart-stat">
          <span className="chart-stat__label">Start</span>
          <strong>{formatMoneyRounded(invested)}</strong>
        </div>
        <div className="chart-stat">
          <span className="chart-stat__label">Kwota na koniec</span>
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
