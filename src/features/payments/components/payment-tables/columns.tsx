"use client";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "../../api/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { Icons } from "@/components/icons";
import { CellAction } from "./cell-action";
import { formatPrice } from "@/lib/format";
import { IconCash, IconCashBanknote, IconDeviceMobile } from "@tabler/icons-react";

export const columns: ColumnDef<DataTableFeatures, Payment>[] = [
  {
    id: "invoice",
    accessorKey: "invoice",
    header: "Invoice Number",
    cell: ({ cell }) => <div>{cell.getValue<Payment["invoice"]>().invoiceNumber}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ cell }) => (
      <div>{formatPrice(cell.getValue<Payment["amount"]>())}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ cell }) => {
      const method = cell.getValue<Payment["method"]>();
      const Icon =
        method === "UPI"
          ? IconDeviceMobile
          : method === "CASH"
            ? IconCash
            : method === "BANK"
              ? IconCashBanknote
              : Icons.creditCard;

      return (
        <Badge variant="outline" className="capitalize">
          <Icon />
          {method}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const status = cell.getValue<Payment["status"]>();
      const Icon =
        status === "SUCCESS"
          ? Icons.circleCheck
          : status === "FAILED"
            ? Icons.xCircle
            : Icons.clock;

      return (
        <Badge variant="outline" className="capitalize">
          <Icon />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ cell }) => {
      const paidAtValue = cell.getValue<Payment["paidAt"]>();
      const paidAt = paidAtValue ? new Date(paidAtValue) : null;
      return <div>{paidAt ? paidAt.toLocaleDateString() : "Not Paid"}</div>;
    },
  },

  {
    id: "actions",
    maxSize: 32,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
