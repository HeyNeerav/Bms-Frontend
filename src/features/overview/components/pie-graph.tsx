"use client";

import { Pie, PieChart } from "recharts";

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

import { Analytics } from "../api/types";

const statusConfig = {
  paid: {
    label: "Paid",
    color: "var(--chart-2)",
  },
  sent: {
    label: "Sent",
    color: "var(--chart-1)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-3)",
  },
  draft: {
    label: "Draft",
    color: "var(--chart-4)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

type InvoiceStatusChartProps = {
  invoiceStats: Analytics["invoiceStats"];
  period?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPeriod = (period: string) => {
  const labels: Record<string, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "12m": "Last 12 months",
    year: "This year",
    lifetime: "All time",
  };

  return labels[period] ?? period;
};

export function InvoiceStatusChart({
  invoiceStats,
  period = "30d",
}: InvoiceStatusChartProps) {
  const chartData = invoiceStats
    .map((item) => {
      const status = item.status.toLowerCase() as keyof typeof statusConfig;
      const config = statusConfig[status];

      if (!config) return null;

      return {
        status,
        count: item.count,
        amount: item.amount,
        fill: config.color,
      };
    })
    .filter((item) => item !== null)
    .filter((item) => item.count > 0);

  const totalInvoices = chartData.reduce(
    (total, item) => total + item.count,
    0,
  );

  const totalAmount = chartData.reduce((total, item) => total + item.amount, 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>
          Distribution of invoices for {formatPeriod(period).toLowerCase()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-6 sm:flex-row sm:items-center">
        {totalInvoices === 0 ? (
          <div className="flex min-h-[240px] flex-1 items-center justify-center text-sm text-muted-foreground">
            No invoice data available for this period.
          </div>
        ) : (
          <>
            <div className="relative mx-auto w-full max-w-[260px] shrink-0">
              <ChartContainer
                config={statusConfig}
                className="mx-auto aspect-square max-h-[260px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="status"
                        hideLabel
                        formatter={(value, name) => (
                          <div className="flex min-w-[130px] items-center justify-between gap-4">
                            <span>{String(name)}</span>
                            <span className="font-mono font-medium">
                              {value}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={68}
                    outerRadius={105}
                    paddingAngle={3}
                    cornerRadius={5}
                    strokeWidth={0}
                  />
                </PieChart>
              </ChartContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold tabular-nums">
                  {totalInvoices}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total invoices
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total invoice value
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {chartData.map((item) => {
                  const percentage = (item.count / totalInvoices) * 100;
                  const config = statusConfig[item.status];

                  return (
                    <div
                      key={item.status}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex shrink-0 items-center gap-2 text-sm">

                       <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-sm"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="text-sm">{config.label}</span>
                        </div>

                        <span className="tabular-nums text-muted-foreground">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                        
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-right font-medium tabular-nums">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
