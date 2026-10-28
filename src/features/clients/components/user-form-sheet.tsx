"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useMutation } from "@tanstack/react-query";
import { createUserMutation, updateUserMutation } from "../api/mutations";
import type { User } from "../api/types";
import { toast } from "sonner";
import { userSchema, type UserFormValues } from "../schemas/user";
import { ROLE_OPTIONS } from "./users-table/options";
import { useBusiness } from "@/components/business-provider";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Invited", label: "Invited" },
];

interface UserFormSheetProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({
  user,
  open,
  onOpenChange,
}: UserFormSheetProps) {
  const isEdit = !!user;

  const business = useBusiness();

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: () => {
      toast.success("User created");
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error("Couldn't create user. Try again."),
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: () => {
      toast.success("User updated");
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't update user. Try again."),
  });

  const form = useAppForm({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      companyName: user?.companyName ?? "",
      gstNumber: user?.gstNumber ?? "",
      notes: user?.notes ?? "",
      tags: user?.tags ?? [],
    } as UserFormValues,
    validators: {
      onSubmit: userSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: user.id, values: value });
      } else {
        await createMutation.mutateAsync({id: business._id, data: value});
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit User" : "New User"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the user details below."
              : "Fill in the details to create a new user."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <form
            id="user-form-sheet"
            className="space-y-4 p-4 md:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    required
                    placeholder="John Doe"
                  />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    required
                    type="email"
                    placeholder="john@example.com"
                  />
                )}
              />

              <form.AppField
                name="phone"
                children={(field) => (
                  <field.TextField
                    label="Phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                )}
              />

              <form.AppField
                name="address"
                children={(field) => (
                  <field.TextField
                    label="Address"
                    placeholder="123 Main St, City, Country"
                  />
                )}
              />

              <form.AppField
                name="companyName"
                children={(field) => (
                  <field.TextField
                    label="Company Name"
                    placeholder="Acme Inc."
                  />
                )}
              />

              <form.AppField
                name="gstNumber"
                children={(field) => (
                  <field.TextField label="GST Number" placeholder="123456789" />
                )}
              />

              <form.AppField
                name="tags"
                children={(field) => (
                  <field.TagsField
                    label="Tags"
                    placeholder="Select tags"
                  />
                )}
              />

              <form.AppField
                name="notes"
                children={(field) => (
                  <field.TextareaField
                    label="Notes"
                    placeholder="Additional information about the client."
                  />
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            type="submit"
            form="user-form-sheet"
          >
            {isEdit ? "Update User" : "Create User"}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Add Client
      </Button>
      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
