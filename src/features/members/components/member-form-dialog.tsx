"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import {
  createMemberMutation,
  updateMemberRoleMutation,
} from "../api/mutations";
import type { Member } from "../api/types";
import { toast } from "sonner";
import { memberSchema, type MemberFormValues } from "../schemas/member";
import { ROLE_OPTIONS } from "./members-table/options";
import { memberKeys } from "../api/queries";

import { ApiError } from "@/lib/api";
import { useAppForm } from "@/lib/form";
import { getQueryClient } from "@/lib/query-client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useBusiness } from "@/components/business-provider";
import { LoadingButton } from "@/components/ui/loading-button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface MemberFormSheetProps {
  member?: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberFormDialog({
  member,
  open,
  onOpenChange,
}: MemberFormSheetProps) {
  const isEdit = !!member;

  const business = useBusiness();

  const createMutation = useMutation({
    ...createMemberMutation,
    onSuccess: (res: any) => {
      getQueryClient().invalidateQueries({
        queryKey: memberKeys.business(business._id),
      });
      toast.success("Member Invited", {
        description: res.message || "The member has been invited successfully.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) =>
      toast.error("Couldn't invite member. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      }),
  });

  const form = useAppForm({
    defaultValues: {
      email: member?.user.email || "",
      role: member?.role || "EMPLOYEE",
    },
    validators: {
      onSubmit: memberSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isEdit) {
        await createMutation.mutateAsync({
          businessId: business._id,
          data: value,
        });
      }
    },
  });

  const isPending = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>
        {isEdit ? (
          <>
            <Icons.edit className="mr-2 h-4 w -4" />
            Edit Role
          </>
        ) : (
          <>
            <Icons.add className="mr-2 h-4 w-4" />
            Invite Member
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Member Role" : "Invite New Member"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Change the role of this member"
              : "Fill out the form below to invite a new member to your business."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="member-form-dialog"
          className="space-y-4 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  type="email"
                  label="Email"
                  description="Enter the member's email address"
                  contentEditable={!isEdit}
                  disabled={isEdit}
                  required={!isEdit}
                />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField
                  options={ROLE_OPTIONS}
                  label="Role"
                  description="Select the member's role"
                  required
                />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <LoadingButton type="submit" form="member-form-dialog" disabled={isPending}>
            {isEdit ? "Update Role" : "Invite Member"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function MemberFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Invite Member
      </Button> */}
      <MemberFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
