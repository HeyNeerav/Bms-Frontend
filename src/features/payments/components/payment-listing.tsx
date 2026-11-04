import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { paymentsQueryOptions } from "../api/queries";
import { PaymentTable } from "./payment-tables";

export default function PaymentListingPage({
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
  void queryClient.query(paymentsQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentTable />
    </HydrationBoundary>
  );
}
