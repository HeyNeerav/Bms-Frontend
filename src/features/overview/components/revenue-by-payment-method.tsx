"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

import { Analytics } from "../api/types";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type RevenueByPaymentMethodChartProps = {
  revenueByPaymentMethod: Analytics["revenueByPaymentMethod"];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

const formatMethod = (method: string) =>
  method
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function RevenueByPaymentMethodChart({
  revenueByPaymentMethod,
}: RevenueByPaymentMethodChartProps) {
  const chartData = [...revenueByPaymentMethod]
    .sort((a, b) => b.revenue - a.revenue)
    .map((payment) => ({
      method: payment.method,
      name: formatMethod(payment.method),
      revenue: payment.revenue,
      transactions: payment.transactions,
    }));

  const totalRevenue = chartData.reduce(
    (total, payment) => total + payment.revenue,
    0,
  );

  const totalTransactions = chartData.reduce(
    (total, payment) => total + payment.transactions,
    0,
  );

  const topMethod = chartData[0];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Revenue by Payment Method</CardTitle>
            <CardDescription>
              Collected revenue across payment methods
            </CardDescription>
          </div>

          {topMethod && (
            <Badge variant="outline" className="shrink-0 gap-1">
              <Icons.trendingUp />
              Most used
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total revenue</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total transactions
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {totalTransactions.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground">
            No payment data available.
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="min-h-[220px] w-full flex-1"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
              >
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="85%"
                  fill="url(#payment-method-pattern-dots)"
                />

                <defs>
                  <pattern
                    id="payment-method-pattern-dots"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      className="text-muted dark:text-muted/40"
                      cx="2"
                      cy="2"
                      r="1"
                      fill="currentColor"
                    />
                  </pattern>

                  <pattern
                    id="payment-method-hatched-bar"
                    x="0"
                    y="0"
                    width="5"
                    height="5"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-45)"
                  >
                    <rect
                      width="10"
                      height="10"
                      fill="var(--color-revenue)"
                      opacity={0.5}
                    />
                    <rect
                      width="1"
                      height="10"
                      fill="var(--color-revenue)"
                    />
                  </pattern>
                </defs>

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={55}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatCurrency}
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dashed"
                      formatter={(value, _name, item) => (
                        <div className="flex min-w-[160px] flex-col gap-1">
                          <div className="flex justify-between gap-4">
                            <span>Revenue</span>
                            <span className="font-mono font-medium">
                              {formatCurrency(Number(value))}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>Transactions</span>
                            <span className="font-mono font-medium">
                              {Number(
                                item.payload.transactions,
                              ).toLocaleString("en-US")}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />

                <Bar
                  dataKey="revenue"
                  fill="url(#payment-method-hatched-bar)"
                  radius={4}
                  maxBarSize={48}
                  
                />
              </BarChart>
            </ChartContainer>

            {topMethod && (
              <div className="flex items-center justify-between gap-3 border-t pt-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Top payment method
                  </p>
                  <p className="truncate text-sm font-medium">
                    {topMethod.name}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(topMethod.revenue)}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
