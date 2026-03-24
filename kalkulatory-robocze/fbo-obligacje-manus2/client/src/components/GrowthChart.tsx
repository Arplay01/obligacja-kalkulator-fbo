/**
 * GrowthChart — Visual comparison of money growth over time
 * Uses Recharts for clean, readable line chart.
 * Shows net value (after tax) for each product over the investment period.
 */
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { formatPLN, type CalculationResult } from '@/lib/calculations';

interface GrowthChartProps {
  results: CalculationResult[];
  invested: number;
}

const COLORS = [
  '#E8A838', // amber - winner
  '#1A1F36', // navy
  '#2D6A4F', // green
  '#6366F1', // indigo
  '#EC4899', // pink
  '#F97316', // orange
  '#06B6D4', // cyan
  '#8B5CF6', // violet
];

function getShortLabel(result: CalculationResult): string {
  if (result.productType === 'deposit') return 'Lokata';
  if (result.productType === 'savings') return 'Konto oszcz.';
  return result.productId;
}

function getYearLabel(year: number): string {
  if (year === 0) return 'Start';
  if (year === 1) return 'Po 1 roku';
  if (year >= 2 && year <= 4) return `Po ${year} latach`;
  return `Po ${year} latach`;
}

export default function GrowthChart({ results, invested }: GrowthChartProps) {
  const { chartData, visibleProducts, yDomain } = useMemo(() => {
    const maxYears = Math.max(...results.map(r => {
      if (r.yearlyBreakdown.length === 0) return r.termMonths / 12;
      return Math.max(...r.yearlyBreakdown.map(y => y.year));
    }));

    const visible = results.filter(r => r.yearlyBreakdown.length > 0 || r.termMonths <= 3);

    const data: Record<string, any>[] = [];
    let minVal = invested;
    let maxVal = invested;

    // Start point
    const startPoint: Record<string, any> = { year: 0 };
    visible.forEach(r => {
      startPoint[r.productId] = invested;
    });
    data.push(startPoint);

    // Year by year
    for (let year = 1; year <= Math.ceil(maxYears); year++) {
      const point: Record<string, any> = { year };

      visible.forEach(r => {
        const breakdown = r.yearlyBreakdown.find(y => Math.ceil(y.year) === year);
        if (breakdown) {
          const taxOnCumulative = breakdown.cumulativeInterest * 0.19;
          const val = Math.round(breakdown.balance - taxOnCumulative);
          point[r.productId] = val;
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        } else if (r.yearlyBreakdown.length > 0) {
          const last = r.yearlyBreakdown[r.yearlyBreakdown.length - 1];
          const taxOnCumulative = last.cumulativeInterest * 0.19;
          const val = Math.round(last.balance - taxOnCumulative);
          point[r.productId] = val;
        } else {
          point[r.productId] = Math.round(r.netReturn);
        }
      });

      data.push(point);
    }

    const padding = (maxVal - minVal) * 0.15;
    const domainMin = Math.floor((minVal - padding) / 100) * 100;
    const domainMax = Math.ceil((maxVal + padding) / 100) * 100;

    return {
      chartData: data,
      visibleProducts: visible,
      yDomain: [Math.max(0, domainMin), domainMax] as [number, number],
    };
  }, [results, invested]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#1A1F36]/8 p-3 text-sm max-w-[260px]">
        <p className="font-semibold text-[#1A1F36] mb-2 text-xs">
          {getYearLabel(label)}
        </p>
        <div className="space-y-1">
          {payload
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any, index: number) => {
              const product = visibleProducts.find(r => r.productId === entry.dataKey);
              const diff = entry.value - invested;
              return (
                <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[#1A1F36]/55 text-[11px]">{product ? getShortLabel(product) : entry.dataKey}</span>
                  </div>
                  <div className="text-right flex items-baseline gap-1.5">
                    <span className="font-semibold text-[#1A1F36] tabular-nums text-[11px]">
                      {formatPLN(entry.value)}
                    </span>
                    {label > 0 && (
                      <span className={`text-[9px] tabular-nums ${diff >= 0 ? 'text-[#2D6A4F]' : 'text-red-500'}`}>
                        {diff >= 0 ? '+' : ''}{formatPLN(diff)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (chartData.length <= 1) return null;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1F36" strokeOpacity={0.04} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: '#1A1F36', fillOpacity: 0.35 }}
            tickFormatter={(v) => v === 0 ? 'Start' : `${v}`}
            axisLine={{ stroke: '#1A1F36', strokeOpacity: 0.06 }}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 10, fill: '#1A1F36', fillOpacity: 0.35 }}
            tickFormatter={(v) => {
              if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
              return `${v}`;
            }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={invested}
            stroke="#1A1F36"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
            label={{
              value: 'Wpłata',
              position: 'insideTopLeft',
              style: { fontSize: 9, fill: '#1A1F36', fillOpacity: 0.25 },
            }}
          />
          <Legend
            formatter={(value: string) => {
              const product = visibleProducts.find(r => r.productId === value);
              return product ? getShortLabel(product) : value;
            }}
            wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
          />
          {visibleProducts.map((product, index) => (
            <Line
              key={product.productId}
              type="monotone"
              dataKey={product.productId}
              name={product.productId}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={index === 0 ? 2.5 : 1.5}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 2 }}
              strokeDasharray={product.productType !== 'bond' ? '5 5' : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-[#1A1F36]/25 mt-1.5 text-center">
        Wartość netto (po podatku Belki). Linia przerywana = lokata/konto. Ciągła = obligacje.
      </p>
    </div>
  );
}
