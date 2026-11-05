import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaGraph } from "@/features/overview/components/area-graph";
import { BarGraph } from "@/features/overview/components/bar-graph";
import { InvoiceStatusChart } from "@/features/overview/components/pie-graph";
import { RecentSales } from "@/features/overview/components/recent-sales";
import { searchParamsCache } from "@/lib/searchparams";
import { getBusinessBySlug } from "@/lib/businesses";
import { getQueryClient } from "@/lib/query-client";
import { Analytics } from "@/features/overview/api/types";
import { ApiResponse } from "@/types";
import { analyticsQueryOptions } from "@/features/overview/api/queries";
import { OverviewCards } from "@/features/overview/components/cards";
import { AnalyticsPeriodFilter } from "@/features/overview/components/period-filter";
import { periodLabels } from "@/features/overview/schemas/analytics";
import { RevenueByPaymentMethodChart } from "@/features/overview/components/revenue-by-payment-method";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ slug: string }>;
};

export default async function OverViewPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, { period }] = await Promise.all([
    params,
    searchParamsCache.parse(searchParams),
  ]);

  const business = await getBusinessBySlug(slug);
  const queryClient = getQueryClient();

  const { data: analytics } = (await queryClient.query({
    ...analyticsQueryOptions(business!._id, period),
  })) as ApiResponse<Analytics>;

  return (
    <PageContainer
      pageTitle="Hi, Welcome back 👋"
      pageDescription={`Here's your business performance for ${periodLabels[analytics.period]}`}
      pageHeaderAction={<AnalyticsPeriodFilter />}
    >
      <div className="flex flex-1 flex-col space-y-2">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <OverviewCards overviewAnalytics={analytics.overview} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
              <div className="col-span-10">
                <AreaGraph
                  revenueTrend={analytics.revenueTrend}
                  revenueChange={analytics.overview.revenueChange}
                  period={analytics.period}
                />
              </div>
              <div className="col-span-5">
                <BarGraph topProducts={analytics.topProducts} />
              </div>
              <div className="col-span-5">
                <InvoiceStatusChart
                  invoiceStats={analytics.invoiceStats}
                  period={analytics.period}
                />
              </div>
              <div className="col-span-5">
                <RecentSales sales={analytics.recentSales} />
              </div>
              <div className="col-span-5">
                <RevenueByPaymentMethodChart revenueByPaymentMethod={analytics.revenueByPaymentMethod} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
