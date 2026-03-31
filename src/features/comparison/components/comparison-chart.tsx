import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ComparisonChartRow,
  ComparisonInstrumentId,
  ComparisonInstrumentResult,
  ComparisonScenarioResult,
  ComparisonSelectableInstrumentId,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import { formatDecisionLabel } from "@/features/comparison/components/decision-meter";
import { formatMoneyRounded, formatPercent } from "@/features/calculator/lib/formatters";

const CHART_KEY_MAP: Record<
  ComparisonInstrumentId,
  Record<ComparisonValueMode, keyof ComparisonChartRow>
> = {
  EDO: {
    net: "EDO_net",
    real: "EDO_real",
  },
  COI: {
    net: "COI_net",
    real: "COI_real",
  },
  TOS: {
    net: "TOS_net",
    real: "TOS_real",
  },
  DEPOSIT: {
    net: "DEPOSIT_net",
    real: "DEPOSIT_real",
  },
  INACTION: {
    net: "INACTION_net",
    real: "INACTION_real",
  },
};

type ComparisonChartProps = {
  scenario: ComparisonScenarioResult;
  displayMode: ComparisonValueMode;
  onDisplayModeChange: (mode: ComparisonValueMode) => void;
};

type TooltipEntry = {
  dataKey?: string | number;
  color?: string;
  value?: number;
  payload?: ComparisonChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  displayMode: ComparisonValueMode;
  activeResults: ComparisonInstrumentResult[];
};

type CustomDotProps = {
  cx?: number;
  cy?: number;
  dataKey?: string | number;
  payload?: ComparisonChartRow;
  stroke?: string;
};

function getInstrumentIdFromDataKey(dataKey: string | number | undefined) {
  if (typeof dataKey !== "string") {
    return null;
  }

  return dataKey.replace(/_(net|real)$/, "") as ComparisonInstrumentId;
}

function getChartValue(
  row: ComparisonChartRow,
  instrumentId: ComparisonInstrumentId,
  displayMode: ComparisonValueMode,
) {
  return row[CHART_KEY_MAP[instrumentId][displayMode]] as number;
}

function getNiceStep(rawStep: number) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) {
    return 100;
  }

  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 2.5) {
    return 2.5 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getYAxisConfig(
  scenario: ComparisonScenarioResult,
  displayMode: ComparisonValueMode,
) {
  const visibleIds: ComparisonInstrumentId[] = [
    ...scenario.activeResults.map((result) => result.id),
    "INACTION",
  ];
  const chartValues = scenario.chartRows.flatMap((row) =>
    visibleIds.map((instrumentId) => getChartValue(row, instrumentId, displayMode)),
  );
  const lowerRaw = Math.min(scenario.amount, ...chartValues);
  const upperRaw = Math.max(scenario.amount, ...chartValues);
  const range = Math.max(upperRaw - lowerRaw, scenario.amount * 0.04, 100);
  const topPadding = Math.max(range * 0.12, scenario.amount * 0.02, 100);
  const tickStep = getNiceStep((upperRaw + topPadding - lowerRaw) / 5);
  const lowerBound = Math.floor(lowerRaw / tickStep) * tickStep;
  const upperBound = Math.ceil((upperRaw + topPadding) / tickStep) * tickStep;
  const ticks: number[] = [];

  for (let tick = lowerBound; tick <= upperBound + tickStep / 2; tick += tickStep) {
    ticks.push(Number(tick.toFixed(2)));
  }

  return {
    domain: [lowerBound, upperBound] as const,
    ticks,
  };
}

function DecisionDot({ cx, cy, dataKey, payload, stroke }: CustomDotProps) {
  const instrumentId = getInstrumentIdFromDataKey(dataKey);

  if (
    !instrumentId ||
    instrumentId === "INACTION" ||
    cx === undefined ||
    cy === undefined ||
    !payload?.details[instrumentId]?.hasDecisionMarker
  ) {
    return null;
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill="rgba(255, 255, 255, 0.82)"
        stroke={stroke}
        strokeWidth={1.8}
        opacity={0.9}
      />
      <circle cx={cx} cy={cy} r={1.7} fill={stroke} opacity={0.86} />
    </g>
  );
}

function CustomTooltip({
  active,
  label,
  payload,
  displayMode,
  activeResults,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const row = payload[0]?.payload;

  if (!row) {
    return null;
  }

  const entryOrder: ComparisonInstrumentId[] = [
    ...activeResults.map((result) => result.id),
    "INACTION",
  ];
  const labelCopy =
    displayMode === "real" ? "Wartość po inflacji" : "Kwota przy wyjściu";

  return (
    <div className="comparison-tooltip" data-comparison-tooltip>
      <p className="comparison-tooltip__title">
        {typeof label === "string" ? label : row.label}
      </p>
      <p className="comparison-tooltip__subtitle">{labelCopy}</p>
      <div className="comparison-tooltip__list">
        {entryOrder.map((instrumentId) => {
          const point = row.details[instrumentId];
          const value =
            displayMode === "real" ? point.realValue : point.netValue;
          const decisionCopy =
            instrumentId === "INACTION"
              ? "0 decyzji"
              : formatDecisionLabel(point.decisions);
          const instrument = activeResults.find((item) => item.id === instrumentId);
          const color = instrument?.color ?? "rgba(41, 39, 35, 0.45)";
          const labelText =
            instrumentId === "INACTION"
              ? "Nic nie robisz"
              : instrument?.label ?? instrumentId;

          return (
            <div key={instrumentId} className="comparison-tooltip__row">
              <span className="comparison-tooltip__label">
                <span
                  className="comparison-tooltip__swatch"
                  style={{ backgroundColor: color }}
                />
                {labelText}
              </span>
              <span className="comparison-tooltip__value">
                {formatMoneyRounded(value)}
              </span>
              <span className="comparison-tooltip__meta">{decisionCopy}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ComparisonChart({
  scenario,
  displayMode,
  onDisplayModeChange,
}: ComparisonChartProps) {
  const markerLines = scenario.activeResults.flatMap((result) =>
    result.id === "DEPOSIT"
      ? []
      : result.markers.map((marker) => ({
          ...marker,
          instrumentId: result.id,
          color: result.color,
        })),
  );
  const bestInstrumentId = scenario.bestInstrumentId;
  const yAxisConfig = getYAxisConfig(scenario, displayMode);

  return (
    <section className="comparison-hero" data-comparison-chart>
      <div className="comparison-hero__header">
        <div className="comparison-hero__lead">
          <p className="micro-label">Wykres ścieżek</p>
          <h2 className="section-title">
            Zestawienie w Twoim horyzoncie czasu
          </h2>
          <p className="comparison-hero__note">
            {formatMoneyRounded(scenario.amount)} przez {scenario.horizonYears} lat
            przy inflacji {formatPercent(scenario.effectiveInflation)}.
          </p>
        </div>

        <div className="chip-row chip-row--compact comparison-mode-switch">
          {(["net", "real"] as ComparisonValueMode[]).map((mode) => {
            const isActive = displayMode === mode;

            return (
              <button
                key={mode}
                className={`chip${isActive ? " chip--active" : ""}`}
                type="button"
                data-mode-toggle={mode}
                aria-pressed={isActive}
                onClick={() => onDisplayModeChange(mode)}
              >
                {mode === "net" ? "Netto" : "Realnie"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="comparison-legend" aria-label="Legenda wykresu">
        {scenario.activeResults.map((result) => (
          <span key={result.id} className="comparison-legend__item">
            <span
              className="comparison-legend__swatch"
              style={{ backgroundColor: result.color }}
            />
            {result.label}
          </span>
        ))}
        <span className="comparison-legend__item comparison-legend__item--muted">
          <span className="comparison-legend__swatch comparison-legend__swatch--muted" />
          Nic nie robisz
        </span>
      </div>

      <div className="comparison-chart-shell">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={scenario.chartRows}
            margin={{ top: 10, right: 12, bottom: 12, left: 6 }}
          >
            <CartesianGrid
              stroke="rgba(41, 39, 35, 0.08)"
              strokeDasharray="4 6"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              minTickGap={12}
              tickFormatter={(value) => (value === 0 ? "Start" : `${value}`)}
            />
            <YAxis
              domain={yAxisConfig.domain}
              ticks={yAxisConfig.ticks}
              tickLine={false}
              axisLine={false}
              width={92}
              tickFormatter={(value) => formatMoneyRounded(value)}
            />
            {markerLines.map((marker) => (
              <ReferenceLine
                key={`${marker.instrumentId}-${marker.year}`}
                x={marker.year}
                stroke={marker.color}
                strokeDasharray="3 6"
                strokeOpacity={0.14}
                ifOverflow="visible"
              />
            ))}
            <Tooltip
              cursor={{ stroke: "rgba(41, 39, 35, 0.14)", strokeDasharray: "3 4" }}
              content={
                <CustomTooltip
                  displayMode={displayMode}
                  activeResults={scenario.activeResults}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={CHART_KEY_MAP.INACTION[displayMode]}
              stroke="rgba(41, 39, 35, 0.45)"
              strokeWidth={2}
              strokeDasharray="7 8"
              dot={false}
              activeDot={{ r: 3.5, fill: "#fff", stroke: "rgba(41, 39, 35, 0.45)" }}
              name="Nic nie robisz"
              isAnimationActive
            />
            {scenario.activeResults.map((result) => (
              <Line
                key={result.id}
                type="monotone"
                dataKey={CHART_KEY_MAP[result.id][displayMode]}
                stroke={result.color}
                strokeWidth={result.id === bestInstrumentId ? 3.4 : 2.7}
                dot={<DecisionDot />}
                activeDot={{ r: 4.4, fill: "#fff", stroke: result.color, strokeWidth: 1.8 }}
                name={result.label}
                isAnimationActive
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="comparison-hero__helper" data-comparison-chart-helper>
        <span className="comparison-hero__helper-icons" aria-hidden="true">
          <svg
            className="comparison-hero__helper-illustration"
            viewBox="0 0 54 14"
            focusable="false"
            aria-hidden="true"
          >
            <circle
              cx="7"
              cy="7"
              r="4.4"
              fill="rgba(255, 255, 255, 0.92)"
              stroke="#cb5647"
              strokeWidth="1.7"
              opacity="0.92"
            />
            <circle cx="7" cy="7" r="1.6" fill="#cb5647" opacity="0.9" />
            <circle
              cx="20"
              cy="7"
              r="4.4"
              fill="rgba(255, 255, 255, 0.92)"
              stroke="#d5942b"
              strokeWidth="1.7"
              opacity="0.92"
            />
            <circle cx="20" cy="7" r="1.6" fill="#d5942b" opacity="0.9" />
            <circle
              cx="35"
              cy="7"
              r="4.4"
              fill="rgba(255, 255, 255, 0.92)"
              stroke="#4a6fa5"
              strokeWidth="1.7"
              opacity="0.92"
            />
            <circle cx="35" cy="7" r="1.6" fill="#4a6fa5" opacity="0.9" />
          </svg>
        </span>
        <p className="helper-text">
          Wyróżnione kropki oznaczają moment nowej decyzji, na przykład zmianę
          lokaty na inną albo wykupienie kolejnych obligacji.
        </p>
      </div>
    </section>
  );
}
