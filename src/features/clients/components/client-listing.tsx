import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { clientsQueryOptions } from "../api/queries";
import { ClientsTable } from "./clients-table";

export default function ClientListingPage({
  businessId,
}: {
  businessId: string;
}) {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("limit");
  const roles = searchParamsCache.get("role");
  const sort = searchParamsCache.get("sort");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(roles && { roles }),
    ...(sort.length > 0 && { sort: JSON.stringify(sort) }),
  };

  const queryClient = getQueryClient();

  void queryClient.query(clientsQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsTable />
    </HydrationBoundary>
  );
}
