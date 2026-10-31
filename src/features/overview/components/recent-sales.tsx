import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/format";
import type { Analytics } from "@/features/overview/api/types";

type RecentSale = Analytics["recentSales"][number];

interface RecentSalesProps {
  sales: RecentSale[];
}

const formatInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          Latest {sales.length} successful payments
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {sales.map((sale) => (
            <div key={sale._id.toString()} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {formatInitials(sale.clientName)}
                </AvatarFallback>
              </Avatar>

              <div className="ml-4 space-y-1">
                <p className="truncate text-sm leading-none font-medium">
                  {sale.clientName}
                </p>

                <p className="text-muted-foreground text-sm">
                  {sale.invoiceNumber} · {sale.method}
                </p>
              </div>

              <div className="ml-auto font-medium tabular-nums">
                <p className="text-right">{formatPrice(sale.amount)}</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(sale.paidAt)}
                </p>
              </div>
            </div>
          ))}

          {sales.length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No recent sales found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
