import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { searchParamsCache } from '@/lib/searchparams';
import { productsQueryOptions } from '../api/queries';
import { ProductTable } from './product-tables';

export default function ProductListingPage({ businessId }: { businessId: string }) {
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
  void queryClient.prefetchQuery(productsQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductTable />
    </HydrationBoundary>
  );
}
