"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteClientMutation } from "../../api/mutations";
import type { Client } from "../../api/types";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClientFormSheet } from "../client-form-sheet";
import { useBusiness } from "@/components/business-provider";
import { getQueryClient } from "@/lib/query-client";
import { clientKeys } from "../../api/queries";
import { ApiError } from "@/lib/api";

interface CellActionProps {
  data: Client;
}

export function CellAction({ data }: CellActionProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const business = useBusiness();

  const deleteMutation = useMutation({
    ...deleteClientMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: clientKeys.business(business._id),
      });
      toast.success("Client deleted successfully");
      setDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to delete client", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() =>
          deleteMutation.mutate({ businessId: business._id, id: data._id })
        }
        loading={deleteMutation.isPending}
      />
      <ClientFormSheet client={data} open={editOpen} onOpenChange={setEditOpen} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Open menu</span>
          <Icons.ellipsis className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Icons.edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <Icons.trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
