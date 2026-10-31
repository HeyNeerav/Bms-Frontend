"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { formatPrice } from "@/lib/format";
import type { Analytics } from "@/features/overview/api/types";

interface AreaGraphProps {
  revenueTrend: Analytics["revenueTrend"];
  revenueChange: Analytics["overview"]["revenueChange"];
  period: Analytics["period"];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const formatDate = (value: string) => {
  const date = new Date(
    /^\d{4}-\d{2}$/.test(value)
      ? `${value}-01T00:00:00Z`
      : `${value}T00:00:00Z`,
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    ...(value.length > 7 ? { day: "numeric" as const } : {}),
    ...(value.length === 4 ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  }).format(date);
};

export function AreaGraph({
  revenueTrend,
  revenueChange,
  period,
}: AreaGraphProps) {
  const isLifetime = revenueChange === null;
  const isIncreasing = (revenueChange ?? 0) > 0;
  const isDecreasing = (revenueChange ?? 0) < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Revenue Trend
          {isLifetime ? (
            <Badge variant="outline">Lifetime</Badge>
          ) : (
            <Badge variant="outline">
              {isIncreasing ? (
                <Icons.trendingUp />
              ) : isDecreasing ? (
                <Icons.trendingDown />
              ) : null}
              {revenueChange! > 0 ? "+" : ""}
              {revenueChange}%
            </Badge>
          )}
        </CardTitle>

        <CardDescription>
          Revenue from successful payments over the last {period}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={revenueTrend}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
                  formatter={(value) => formatPrice(Number(value))}
                />
              }
            />

            <defs>
              <DottedBackgroundPattern config={chartConfig} />
            </defs>

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#dotted-background-pattern-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              strokeWidth={1.5}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.entries(config).map(([key, value]) => ({
    key,
    color: value.color,
  }));

  return (
    <>
      {items.map(({ key, color }) => (
        <pattern
          key={key}
          id={`dotted-background-pattern-${key}`}
          x="0"
          y="0"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="1.5" fill={color} opacity={0.5} />
        </pattern>
      ))}
    </>
  );
};
