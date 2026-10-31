"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Member } from "../../api/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { Icons } from "@/components/icons";
import { CellAction } from "./cell-action";

const formatMemberSince = (isoString: Date | string): string => {
  const joinedDate = new Date(isoString);

  if (isNaN(joinedDate.getTime())) {
    return "unknown";
  }

  const now = new Date();
  const diffInMs = now.getTime() - joinedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) return "just now";
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const day = String(joinedDate.getDate()).padStart(2, "0");
  const month = String(joinedDate.getMonth() + 1).padStart(2, "0");
  const year = joinedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const columns: ColumnDef<DataTableFeatures, Member>[] = [
  {
    id: "search",
    accessorKey: "search",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.user.name || "No Name"}
        </span>
        <span className="text-muted-foreground text-xs">
          {row.original.user.email || "No Email"}
        </span>
      </div>
    ),
    meta: {
      label: "Name",
      placeholder: "Search users...",
      variant: "text" as const,
      icon: Icons.text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ cell }) => (
      <Badge variant="secondary" className="text-xs">
        {cell.getValue<Member["role"]>()}
      </Badge>
    ),
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ cell }) => (
      <span className="text-xs text-muted-foreground">
        {formatMemberSince(cell.getValue<Member["joinedAt"]>())}
      </span>
    ),
  },
  {
    id: "actions",
    maxSize: 32,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
