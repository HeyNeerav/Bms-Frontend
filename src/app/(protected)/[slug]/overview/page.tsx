import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { InvoiceStatusChart } from '@/features/overview/components/pie-graph';
import { RecentSales } from '@/features/overview/components/recent-sales';
import { searchParamsCache } from '@/lib/searchparams';
import { getBusinessBySlug } from '@/lib/businesses';
import { getQueryClient } from '@/lib/query-client';
import { Analytics } from '@/features/overview/api/types';
import { ApiResponse } from '@/types';
import { analyticsQueryOptions } from '@/features/overview/api/queries';
import { OverviewCards } from '@/features/overview/components/cards';
import { AnalyticsPeriodFilter } from '@/features/overview/components/period-filter';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ slug: string }>;
};

const periodLabels = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  year: "This year",
  lifetime: "Lifetime",
};

export default async function OverViewPage({ params, searchParams }: PageProps) {
  const [{ slug }, { period }] = await Promise.all([
    params,
    searchParamsCache.parse(searchParams),
  ]);

  const business = await getBusinessBySlug(slug);
  const queryClient = getQueryClient();

  const { data: analytics } = (await queryClient.query({
    ...analyticsQueryOptions(business!._id, period),
    staleTime: "static",
  })) as ApiResponse<Analytics>;

  return (
    <PageContainer
      pageTitle="Hi, Welcome back 👋"
      pageDescription={`Here's your business performance for ${periodLabels[analytics.period]}`}
      pageHeaderAction={<AnalyticsPeriodFilter />}
    >
      <div className='flex flex-1 flex-col space-y-2'>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <OverviewCards overviewAnalytics={analytics.overview} />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <AreaGraph 
                  revenueTrend={analytics.revenueTrend}
                  revenueChange={analytics.overview.revenueChange}
                  period={analytics.period}
                />
              </div>
              <div className='col-span-4 md:col-span-3'>
                <RecentSales sales={analytics.recentSales} />
              </div>
              <div className='col-span-4'>
                <BarGraph topProducts={analytics.topProducts} />
              </div>
              <div className='col-span-4 md:col-span-3'>
                <InvoiceStatusChart invoiceStats={analytics.invoiceStats} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
