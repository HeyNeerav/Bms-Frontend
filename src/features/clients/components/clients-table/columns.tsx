'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Client } from '../../api/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/lib/data-table-features';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';

export const columns: ColumnDef<DataTableFeatures, Client>[] = [
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
      placeholder: 'Search clients...',
      variant: 'text' as const,
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'PHONE'
  },
  {
    accessorKey: 'address',
    header: 'ADDRESS',
  },
  {
    accessorKey: 'companyName',
    header: 'COMPANY NAME',
  }, 
  {
    accessorKey: 'gstNumber',
    header: 'GST NUMBER',
  },
  {
    accessorKey: 'tags',
    header: 'TAGS',
    cell: ({ row }) => (
      <div className='flex flex-wrap gap-1'>
        {row.original.tags?.map((tag) => (
          <Badge key={tag} variant='secondary' className='text-xs'>
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'notes',
    header: 'NOTES',
    cell: ({ row }) => (
      <div className='text-wrap'>
        {row.original.notes}
      </div>
    ),
  },
  {
    id: "actions",
    maxSize: 32,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
