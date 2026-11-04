"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { clientsQueryOptions } from "../../api/queries";
import { columns } from "./columns";

export function ClientsTable({ businessId }: { businessId: string }) {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    name: parseAsString,
    sortBy: parseAsString,
    sortOrder: parseAsStringLiteral(["asc", "desc"] as const).withDefault("asc"),
  });

  const filters = {
    page: params.page,
    limit: params.limit,
    ...(params.name && { search: params.name }),
    ...(params.sortBy && { sortBy: params.sortBy }),
  };

  const { data } = useSuspenseQuery(clientsQueryOptions(businessId, filters));

  const pageCount = Math.ceil(data.total_clients / params.limit);

  const { table } = useDataTable({
    data: data.clients,
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

export function ClientsTableSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4">
      <div className="bg-muted h-10 w-full rounded" />
      <div className="bg-muted h-96 w-full rounded-lg" />
      <div className="bg-muted h-10 w-full rounded" />
    </div>
  );
}
