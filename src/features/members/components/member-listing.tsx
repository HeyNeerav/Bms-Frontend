import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { searchParamsCache } from "@/lib/searchparams";
import { membersQueryOptions } from "../api/queries";
import { MembersTable } from "./members-table";

export default function MemberListingPage({
  businessId,
}: {
  businessId: string;
}) {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const pageLimit = searchParamsCache.get("limit");
  const roles = searchParamsCache.get("role");
  const sortBy = searchParamsCache.get("sortBy");
  const sortOrder = searchParamsCache.get("sortOrder");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(roles && { roles }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  };

  const queryClient = getQueryClient();

  void queryClient.query(membersQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersTable />
    </HydrationBoundary>
  );
}
