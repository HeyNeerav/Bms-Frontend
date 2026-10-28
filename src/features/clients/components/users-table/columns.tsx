'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { User } from '../../api/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/lib/data-table-features';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { ROLE_OPTIONS } from './options';

export const columns: ColumnDef<DataTableFeatures, User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Name' />,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>
          {row.original.name}
        </span>
        <span className='text-muted-foreground text-xs'>{row.original.email}</span>
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search users...',
      variant: 'text' as const,
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'PHONE'
  },
];
