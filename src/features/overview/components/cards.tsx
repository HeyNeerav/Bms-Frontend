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

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPrice(totalRevenue)}
          </CardTitle>
          <CardAction>
            {revenueChange !== null ? (
              <Badge variant="outline">
                {revenueIncreased ? (
                  <Icons.trendingUp />
                ) : revenueDecreased ? (
                  <Icons.trendingDown />
                ) : null}
                {revenueChange > 0 ? "+" : ""}
                {revenueChange}%
              </Badge>
            ) : (
              <Badge variant="outline">Lifetime</Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueChange === null
              ? "Lifetime revenue"
              : revenueIncreased
                ? "Revenue increased this period"
                : revenueDecreased
                  ? "Revenue decreased this period"
                  : "Revenue remained unchanged"}
            {revenueIncreased ? (
              <Icons.trendingUp className="size-4" />
            ) : revenueDecreased ? (
              <Icons.trendingDown className="size-4" />
            ) : null}
          </div>
          <div className="text-muted-foreground">
            Based on successful payments
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Invoices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInvoices.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Icons.fileTypeDoc />
              {paidInvoices} paid
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {unpaidInvoices} unpaid invoices
          </div>
          <div className="text-muted-foreground">
            {paidInvoices} paid out of {totalInvoices} invoices
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Transaction Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPrice(averageTransactionValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{totalPayments} payments</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Average successful payment
          </div>
          <div className="text-muted-foreground">
            Based on {totalPayments.toLocaleString()} successful payments
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Outstanding Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPrice(outstandingAmount)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Icons.alertCircle />
              {overdueInvoices} overdue
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {overdueInvoices} overdue invoices
          </div>
          <div className="text-muted-foreground">
            Currently outstanding across invoices
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
