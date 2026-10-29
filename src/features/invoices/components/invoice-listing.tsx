import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { invoicesQueryOptions } from '../api/queries';
import { InvoiceTable } from './invoice-tables';

export default function InvoiceListingPage({ businessId }: { businessId: string }) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sort.length > 0 && { sort: JSON.stringify(sort) })
  };

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(invoicesQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InvoiceTable />
    </HydrationBoundary>
  );
}
