"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { paymentsQueryOptions } from "../../api/queries";
import { columns } from "./columns";
import { useBusiness } from "@/components/business-provider";

export function PaymentTable() {
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
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  };

  const business = useBusiness();

  const { data } = useSuspenseQuery(
    paymentsQueryOptions(business._id, filters),
  );

  const pageCount = Math.ceil(data.total_payments / params.limit);

  const { table } = useDataTable({
    data: data.payments,
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
