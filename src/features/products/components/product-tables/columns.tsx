'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Product } from '../../api/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { DataTableFeatures } from '@/lib/data-table-features';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { formatPrice } from '@/lib/format';

export const columns: ColumnDef<DataTableFeatures, Product>[] = [
  {
    accessorKey: 'image.url',
    header: 'Image',
    maxSize: 130,
    cell: ({ row }) => {
      return (
        <Image
          src={row.original.image?.url ?? '/images/placeholder.png'}
          alt={row.getValue('name')}
          height={92}
          width={92}
          className='rounded-lg'
        />
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} label='Name' />,
    cell: ({ cell }) => <div>{cell.getValue<Product['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search products...',
      variant: 'text',
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'price',
    header: "Price",
    cell: ({ cell }) => <div>{formatPrice(cell.getValue<Product['price']>())}</div>,
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ cell }) => {
      const status = cell.getValue<Product['type']>();
      const Icon = status === 'PRODUCT' ? Icons.product : Icons.userPen  ;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status}
        </Badge>
      );
    }
  },
  {
    id: 'category',
    accessorKey: 'category',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} label='Category' />,
    cell: ({ cell }) => {
      const status = cell.getValue<Product['category']>();
      const Icon = status === 'active' ? Icons.circleCheck : Icons.xCircle;

      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {status}
        </Badge>
      );
    },
  },
  // {
  //   accessorKey: 'description',
  //   header: 'Desc'
  // },

  {
    id: 'actions',
    maxSize: 32,
    cell: ({ row }) => < CellAction data={ row.original } />
  }
];
