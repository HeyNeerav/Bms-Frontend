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
import { deleteMemberMutation } from "../../api/mutations";
import type { Member } from "../../api/types";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MemberFormDialog } from "../member-form-dialog";
import { useBusiness } from "@/components/business-provider";
import { getQueryClient } from "@/lib/query-client";
import { memberKeys } from "../../api/queries";
import { ApiError } from "@/lib/api";

interface CellActionProps {
  data: Member;
}

export function CellAction({ data }: CellActionProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const business = useBusiness();

  const deleteMutation = useMutation({
    ...deleteMemberMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: memberKeys.business(business._id),
      });
      toast.success("Member deleted successfully");
      setDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to delete member", {
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
          deleteMutation.mutate({ businessId: business._id, userId: data.user._id })
        }
        loading={deleteMutation.isPending}
      />
      <MemberFormDialog member={data} open={editOpen} onOpenChange={setEditOpen} />
      <Button onClick={() => setDeleteOpen(true)} variant="ghost" className="hover:text-red-700">
        <Icons.trash />
      </Button>

      {/* <DropdownMenu modal={false}>
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
              <Icons.edit className="mr-2 h-4 w-4" /> Update Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <Icons.trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}
