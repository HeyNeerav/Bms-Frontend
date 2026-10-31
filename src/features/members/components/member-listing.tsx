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
  const sort = searchParamsCache.get("sort");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(roles && { roles }),
    ...(sort.length > 0 && { sort: JSON.stringify(sort) }),
  };

  const queryClient = getQueryClient();

  void queryClient.query(membersQueryOptions(businessId, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MembersTable />
    </HydrationBoundary>
  );
}
