import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { productsQueryOptions } from "../api/queries";
import { ProductTable } from "./product-tables";

export default function ProductListingPage({
  businessId,
}: {
  businessId: string;
}) {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("limit");
  const sortBy = searchParamsCache.get("sortBy");
  const sortOrder = searchParamsCache.get("sortOrder");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  };

  const queryClient = getQueryClient();
  void queryClient.query(productsQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductTable />
    </HydrationBoundary>
  );
}
