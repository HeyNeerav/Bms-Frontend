import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { AnalyticsOverview } from "../api/types";

export function OverviewCards({
  overviewAnalytics,
}: {
  overviewAnalytics: AnalyticsOverview;
}) {
  const {
    totalRevenue,
    revenueChange,
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    averageTransactionValue,
    totalPayments,
    outstandingAmount,
    overdueInvoices,
  } = overviewAnalytics;

  const revenueIncreased = (revenueChange ?? 0) > 0;
  const revenueDecreased = (revenueChange ?? 0) < 0;

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      action: (
        <Badge variant="outline">
          {revenueChange === null ? (
            "Lifetime"
          ) : (
            <>
              {revenueIncreased ? (
                <Icons.trendingUp />
              ) : revenueDecreased ? (
                <Icons.trendingDown />
              ) : null}
              {revenueChange > 0 ? "+" : ""}
              {revenueChange}%
            </>
          )}
        </Badge>
      ),
      description:
        revenueChange === null
          ? "Lifetime revenue"
          : revenueIncreased
            ? "Revenue increased this period"
            : revenueDecreased
              ? "Revenue decreased this period"
              : "Revenue remained unchanged",
      footer: "Based on successful payments",
      trendIcon: revenueIncreased ? (
        <Icons.trendingUp className="size-4" />
      ) : revenueDecreased ? (
        <Icons.trendingDown className="size-4" />
      ) : null,
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toLocaleString(),
      action: (
        <Badge variant="outline">
          <Icons.fileTypeDoc />
          {paidInvoices} paid
        </Badge>
      ),
      description: `${unpaidInvoices} unpaid invoices`,
      footer: `${paidInvoices} paid out of ${totalInvoices} invoices`,
    },
    {
      title: "Average Transaction Value",
      value: formatPrice(averageTransactionValue),
      action: <Badge variant="outline">{totalPayments} payments</Badge>,
      description: "Average successful payment",
      footer: `Based on ${totalPayments.toLocaleString()} successful payments`,
    },
    {
      title: "Outstanding Balance",
      value: formatPrice(outstandingAmount),
      action: (
        <Badge variant="outline">
          <Icons.alertCircle />
          {overdueInvoices} overdue
        </Badge>
      ),
      description: `${overdueInvoices} overdue invoices`,
      footer: "Currently outstanding across invoices",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="@container/card grid grid-rows-2">
          <CardHeader className="grid-cols-[1fr_auto]">
            <CardDescription className="min-w-0 whitespace-normal">
              {card.title}
            </CardDescription>

            <CardAction className="shrink-0">{card.action}</CardAction>

            <CardTitle className="col-span-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col items-start justify-end gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.description}
              {card.trendIcon}
            </div>
            <div className="text-muted-foreground">{card.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
