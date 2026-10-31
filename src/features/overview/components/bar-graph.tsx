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
    label: "Invoice Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type BarGraphProps = {
  topProducts: Analytics["topProducts"];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

export function BarGraph({ topProducts }: BarGraphProps) {
  const chartData = [...topProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      revenue: product.revenue,
      quantitySold: product.quantitySold,
    }));

  const totalRevenue = chartData.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const totalQuantity = chartData.reduce(
    (total, product) => total + product.quantitySold,
    0,
  );

  const topProduct = chartData[0];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Top Products & Services</CardTitle>
            <CardDescription>
              Best performing offerings by invoice revenue
            </CardDescription>
          </div>

          {topProduct && (
            <Badge variant="outline" className="shrink-0 gap-1">
              <Icons.trendingUp />
              Top performer
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Revenue generated</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Units / services sold
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {totalQuantity.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12 text-sm text-muted-foreground">
            No product or service sales available.
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
                  fill="url(#top-products-pattern-dots)"
                />

                <defs>
                  <DottedBackgroundPattern />

                  <pattern
                    id="top-products-hatched-bar"
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
                    <rect width="1" height="10" fill="var(--color-revenue)" />
                  </pattern>
                </defs>

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value: string) =>
                    value.length > 12 ? `${value.slice(0, 12)}…` : value
                  }
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
                        <div className="flex min-w-[150px] flex-col gap-1">
                          <div className="flex justify-between gap-4">
                            <span>Revenue</span>
                            <span className="font-mono font-medium">
                              {formatCurrency(Number(value))}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>Quantity sold</span>
                            <span className="font-mono font-medium">
                              {Number(item.payload.quantitySold).toLocaleString(
                                "en-US",
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />

                <Bar
                  dataKey="revenue"
                  fill="url(#top-products-hatched-bar)"
                  radius={4}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>

            {topProduct && (
              <div className="flex items-center justify-between gap-3 border-t pt-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Best performing offering
                  </p>
                  <p className="truncate text-sm font-medium">
                    {topProduct.name}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(topProduct.revenue)}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DottedBackgroundPattern() {
  return (
    <pattern
      id="top-products-pattern-dots"
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
  );
}
