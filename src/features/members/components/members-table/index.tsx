"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  getColumnFilterParser,
  getSortingStateParser,
} from "@/lib/data-table-parsers";
import { membersQueryOptions } from "../../api/queries";
import { columns } from "./columns";
import { useBusiness } from "@/components/business-provider";
import { useDebounce } from "@/hooks/use-debounce";

export function MembersTable() {
  const business = useBusiness();

  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    // Same parser as the server searchParamsCache, so the prefetched query key matches
    sort: getSortingStateParser().withDefault([]),
  });

  const [searchFilters] = useQueryStates({
    search: getColumnFilterParser("search", "text"),
  });

  const search = searchFilters.search?.[0]?.value;
  const debouncedSearch = useDebounce(
    typeof search === "string" ? search : "",
    500,
  );

  const filters = {
    page: params.page,
    limit: params.limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) }),
  };

  const { data } = useSuspenseQuery(membersQueryOptions(business._id, filters));

  const pageCount = Math.ceil(data.total_members / params.limit);

  const { table } = useDataTable({
    data: data.members,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 500,
    initialState: {
      columnPinning: { start: [], end: ["actions"] },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export function MembersTableSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4">
      <div className="bg-muted h-10 w-full rounded" />
      <div className="bg-muted h-96 w-full rounded-lg" />
      <div className="bg-muted h-10 w-full rounded" />
    </div>
  );
}
