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
import { createClientMutation, updateClientMutation } from "../api/mutations";
import type { Client } from "../api/types";
import { toast } from "sonner";
import { clientSchema, type ClientFormValues } from "../schemas/client";
import { useBusiness } from "@/components/business-provider";
import { clientKeys } from "../api/queries";
import { getQueryClient } from "@/lib/query-client";
import { ApiError } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Invited", label: "Invited" },
];

interface ClientFormSheetProps {
  client?: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientFormSheet({
  client,
  open,
  onOpenChange,
}: ClientFormSheetProps) {
  const isEdit = !!client;

  const business = useBusiness();

  const createMutation = useMutation({
    ...createClientMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: clientKeys.business(business._id),
      });
      toast.success("Client created");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) =>
      toast.error("Couldn't create client. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      }),
  });

  const updateMutation = useMutation({
    ...updateClientMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: clientKeys.business(business._id),
      });
      toast.success("Client updated");
      onOpenChange(false);
    },
    onError: (error: any) =>
      toast.error("Couldn't update client. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      }),
  });

  const form = useAppForm({
    defaultValues: {
      name: client?.name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      address: client?.address ?? "",
      companyName: client?.companyName ?? "",
      gstNumber: client?.gstNumber ?? "",
      notes: client?.notes ?? "",
      tags: client?.tags ?? [],
    } as ClientFormValues,
    validators: {
      onSubmit: clientSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({
          businessId: business._id,
          id: client._id,
          values: value,
        });
      } else {
        await createMutation.mutateAsync({
          businessId: business._id,
          data: value,
        });
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Client" : "New Client"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the client details below."
              : "Fill in the details to create a new client."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <form
            id="client-form-sheet"
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
                  <field.TagsField label="Tags" placeholder="Select tags" />
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
            form="client-form-sheet"
          >
            {isEdit ? "Update Client" : "Create Client"}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ClientFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Add Client
      </Button>
      <ClientFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
