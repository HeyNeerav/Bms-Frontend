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
import { deletePaymentMutation } from "../../api/mutations";
import type { Payment } from "../../api/types";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBusiness } from "@/components/business-provider";
import { getQueryClient } from "@/lib/query-client";
import { paymentKeys } from "../../api/queries";
import { ApiError } from "@/lib/api";

interface CellActionProps {
  data: Payment;
}

export function CellAction({ data }: CellActionProps) {
  const [open, setOpen] = useState(false);
  const business = useBusiness();

  const deleteMutation = useMutation({
    ...deletePaymentMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: paymentKeys.business(business._id),
      });
      toast.success("Payment deleted successfully");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to delete payment", {
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
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() =>
          deleteMutation.mutate({ businessId: business._id, id: data._id })
        }
        loading={deleteMutation.isPending}
      />
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
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Icons.eyeOff className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Icons.trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
