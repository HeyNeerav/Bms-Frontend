"use client";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "../../api/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { Icons } from "@/components/icons";
import { CellAction } from "./cell-action";
import { formatPrice } from "@/lib/format";

export const columns: ColumnDef<DataTableFeatures, Invoice>[] = [
  {
    id: "invoiceNumber",
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({ cell }) => <div>{cell.getValue<Invoice["invoiceNumber"]>()}</div>,
  },
  {
    id: "client",
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.client?.name || ""}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.client?.email || ""}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ cell }) => (
      <div>{formatPrice(cell.getValue<Invoice["subtotal"]>())}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ cell }) => (
      <div>{cell.getValue<Invoice["discount"]>()}%</div>
    ),
    size: 80,
  },
  {
    accessorKey: "tax",
    header: "Tax",
    cell: ({ cell }) => (
      <div>{cell.getValue<Invoice["tax"]>()}%</div>
    ),
    size: 60
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ cell }) => (
      <div>{formatPrice(cell.getValue<Invoice["total"]>())}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ cell }) => {
      const dueDate = new Date(cell.getValue<Invoice["dueDate"]>() || "");
      return <div>{dueDate.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ cell }) => {
      const paidAtValue = cell.getValue<Invoice["paidAt"]>();
      const paidAt = paidAtValue ? new Date(paidAtValue) : null;
      return <div>{paidAt ? paidAt.toLocaleDateString() : "Not Paid"}</div>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const status = cell.getValue<Invoice["status"]>();
      const Icon =
        status === "PAID"
          ? Icons.check
          : status === "SENT"
            ? Icons.send
            : status === "DRAFT"
              ? Icons.fileTypePdf
              : status === "OVERDUE"
                ? Icons.clock
                : Icons.xCircle;

      return (
        <Badge variant="outline" className="capitalize">
          <Icon />
          {status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    maxSize: 32,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
