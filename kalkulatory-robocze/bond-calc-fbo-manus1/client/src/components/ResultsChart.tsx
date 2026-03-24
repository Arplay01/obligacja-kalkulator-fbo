/**
 * Results Chart – Visual comparison of bond returns
 * Design: "Forteca Finansowa" – Dashboard Clarity
 * Clean Recharts with per-bond colors, responsive containers, custom tooltips
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  type CalculatorResults,
  formatPLN,
} from "@/lib/bondCalculator";

interface Props {
  results: CalculatorResults;
}

const GRID_COLOR = "oklch(0.92 0.004 260)";
const AXIS_COLOR = "oklch(0.55 0.015 260)";

function ProfitTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs">Zysk netto</span>
        <span className="tabular-nums font-bold" style={{ color: entry.fill }}>
          {formatPLN(entry.value)}
        </span>
      </div>
    </div>
  );
}

function RealReturnTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const val = entry.value as number;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs">Realna stopa</span>
        <span className={`tabular-nums font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {val >= 0 ? '+' : ''}{val.toFixed(2)}%
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        {val >= 0 ? 'Powyżej inflacji' : 'Poniżej inflacji'}
      </p>
    </div>
  );
}

function GrowthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground text-xs">{entry.name}</span>
          </div>
          <span className="tabular-nums font-medium text-xs">
            {formatPLN(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsChart({ results }: Props) {
  const [activeTab, setActiveTab] = useState("profit");

  // Prepare bar chart data
  const barData = [
    ...results.bonds.map(r => ({
      name: r.bondInfo.name,
      profit: r.totalInterestAfterTax,
      realReturn: r.realReturnRate,
      color: r.bondInfo.color,
      fullName: r.bondInfo.fullName,
    })),
    {
      name: "Lokata",
      profit: results.depositResult.totalInterestAfterTax,
      realReturn: results.depositResult.realReturnRate,
      color: "#F59E0B",
      fullName: "Lokata bankowa",
    },
  ];

  // Prepare line chart data (yearly growth for multi-year bonds)
  const multiYearBonds = results.bonds.filter(r => r.yearlyBreakdown.length > 1);
  const maxYears = Math.max(...multiYearBonds.map(r => r.yearlyBreakdown.length), 0);

  const lineData = Array.from({ length: maxYears }, (_, i) => {
    const point: Record<string, any> = { year: `Rok ${i + 1}` };
    multiYearBonds.forEach(r => {
      const row = r.yearlyBreakdown[i];
      if (row) {
        point[r.bondInfo.name] = row.totalValue;
      }
    });
    return point;
  });

  // Y-axis formatter
  const formatYAxisPLN = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
    return `${v}`;
  };

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          Wizualizacja wyników
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-5 flex-wrap h-auto gap-1">
            <TabsTrigger value="profit" className="text-xs sm:text-sm">Zysk netto</TabsTrigger>
            <TabsTrigger value="realReturn" className="text-xs sm:text-sm">Realna stopa zwrotu</TabsTrigger>
            {lineData.length > 0 && (
              <TabsTrigger value="growth" className="text-xs sm:text-sm">Wzrost w czasie</TabsTrigger>
            )}
          </TabsList>

          {/* Net Profit Bar Chart */}
          <TabsContent value="profit">
            <div className="h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={{ stroke: GRID_COLOR }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: AXIS_COLOR }}
                    tickFormatter={formatYAxisPLN}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <RechartsTooltip content={<ProfitTooltip />} cursor={{ fill: 'oklch(0.96 0.005 240)', opacity: 0.5 }} />
                  <Bar dataKey="profit" name="Zysk netto" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.88} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Zysk netto po podatku Belki (lub bez, jeśli IKE/IKZE)
            </p>
          </TabsContent>

          {/* Real Return Bar Chart */}
          <TabsContent value="realReturn">
            <div className="h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: AXIS_COLOR }}
                    axisLine={{ stroke: GRID_COLOR }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: AXIS_COLOR }}
                    tickFormatter={(v) => `${v.toFixed(1)}%`}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <ReferenceLine y={0} stroke="oklch(0.55 0.015 260)" strokeWidth={1.5} strokeDasharray="4 2" />
                  <RechartsTooltip content={<RealReturnTooltip />} cursor={{ fill: 'oklch(0.96 0.005 240)', opacity: 0.5 }} />
                  <Bar dataKey="realReturn" name="Realna stopa (%)" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {barData.map((entry, index) => {
                      const val = entry.realReturn;
                      return (
                        <Cell
                          key={index}
                          fill={val >= 0 ? '#22C55E' : '#EF4444'}
                          fillOpacity={0.82}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Zielony = powyżej inflacji &nbsp;·&nbsp; Czerwony = poniżej inflacji
            </p>
          </TabsContent>

          {/* Growth Line Chart */}
          {lineData.length > 0 && (
            <TabsContent value="growth">
              <div className="h-[280px] sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: AXIS_COLOR }}
                      axisLine={{ stroke: GRID_COLOR }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: AXIS_COLOR }}
                      tickFormatter={formatYAxisPLN}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <RechartsTooltip content={<GrowthTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      iconType="circle"
                      iconSize={8}
                    />
                    {multiYearBonds.map(r => (
                      <Line
                        key={r.bondType}
                        type="monotone"
                        dataKey={r.bondInfo.name}
                        stroke={r.bondInfo.color}
                        strokeWidth={2}
                        dot={{ r: 3, fill: r.bondInfo.color, strokeWidth: 0 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Wartość inwestycji w czasie (z kapitalizacją odsetek)
              </p>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
