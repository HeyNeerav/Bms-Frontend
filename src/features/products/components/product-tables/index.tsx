'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { getColumnFilterParser, getSortingStateParser } from '@/lib/data-table-parsers';
import { productsQueryOptions } from '../../api/queries';
import { columns } from './columns';
import { useBusiness } from '@/components/business-provider';
import { useDebounce } from '@/hooks/use-debounce';

export function ProductTable() {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser().withDefault([])
  });

  const [nameFilters] = useQueryStates({
    name: getColumnFilterParser('name', 'text')
  });

  const search = nameFilters.name?.[0]?.value;
  const debouncedSearch = useDebounce(
    typeof search === 'string' ? search : '',
    500
  );

  const filters = {
    page: params.page,
    limit: params.perPage,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(params.sort.length > 0 && { sortBy: JSON.stringify(params.sort) })
  };

  const business = useBusiness();

  const { data } = useSuspenseQuery(productsQueryOptions(business._id, filters));

  const pageCount = Math.ceil(data.total_products / params.perPage);

  const { table } = useDataTable({
    data: data.products,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 500,
    initialState: {
      columnPinning: { start: [], end: ['actions'] }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
