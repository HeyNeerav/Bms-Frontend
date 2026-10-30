"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import {
  paymentSchema,
  type PaymentFormValues,
} from "@/features/payments/schemas/payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPaymentMutation } from "../api/mutations";
import type { Payment } from "../api/types";
import { useBusiness } from "@/components/business-provider";
import { ApiError } from "@/lib/api";
import { paymentMethods, paymentStatuses } from "./payment-tables/options";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { invoicesQueryOptions } from "@/features/invoices/api/queries";

export default function PaymentForm({
  initialData,
  pageTitle,
}: {
  initialData: Payment | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;
  const business = useBusiness();

  const createMutation = useMutation({
    ...createPaymentMutation,
    onSuccess: () => {
      toast.success("Payment created");
      router.push(`/${business?.slug}/payments`);
    },
    onError: (error: any) => {
      toast.error("Couldn't create payment. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      invoiceId: initialData?.invoice || "",
      amount: initialData?.amount || 0,
      method: initialData?.method || "CASH",
      status: initialData?.status || "PENDING",
      transactionId: initialData?.transactionId || undefined,
      paidAt: initialData?.paidAt ? new Date(initialData.paidAt) : undefined,
      notes: initialData?.notes || undefined,
    } as PaymentFormValues,
    validators: {
      onSubmit: paymentSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        invoiceId: value.invoiceId,
        amount: value.amount,
        method: value.method,
        status: value.status,
        transactionId: value.transactionId,
        paidAt: value.paidAt,
        notes: value.notes,
      };
      const businessId = business?._id;

      if (!isEdit) {
        createMutation.mutate({ businessId, data: payload });
      }
    },
  });

  const isPending = createMutation.isPending;

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const search = useDebounce(invoiceSearch, 300);

  const { data: invoiceQueryData, isLoading: isInvoiceLoading } = useQuery(
    invoicesQueryOptions(business._id, {
      ...(search && { search }),
      page: 1,
      limit: 10,
    }),
  );

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="invoiceId"
              children={(field) => (
                <field.ComboboxField
                  label="Invoice"
                  placeholder="Select a invoice"
                  searchPlaceholder="Search invoices..."
                  searchValue={invoiceSearch}
                  onSearchChange={setInvoiceSearch}
                  loading={isInvoiceLoading}
                  required
                  options={
                    invoiceQueryData?.invoices?.map((invoice) => ({
                      value: invoice._id,
                      label: invoice.invoiceNumber,
                      description: `${invoice.client.name} · ${invoice.client.email}`,
                    })) ?? []
                  }
                />
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <form.AppField
                name="amount"
                children={(field) => (
                  <field.TextField
                    type="number"
                    min={0}
                    step={0.01}
                    label="Amount"
                    description="Enter the amount"
                  />
                )}
              />
              <form.AppField
                name="method"
                children={(field) => (
                  <field.SelectField
                    label="Method"
                    description="Select the payment method"
                    options={paymentMethods}
                  />
                )}
              />
              <form.AppField
                name="status"
                children={(field) => (
                  <field.SelectField
                    label="Status"
                    description="Select the payment status"
                    options={paymentStatuses}
                  />
                )}
              />
              <form.AppField
                name="transactionId"
                children={(field) => (
                  <field.TextField
                    type="text"
                    label="Transaction ID"
                    description="Enter the transaction ID"
                  />
                )}
              />
              <form.AppField
                name="paidAt"
                children={(field) => (
                  <field.DatePickerField
                    label="Paid At"
                    description="Select the date when the payment was made"
                  />
                )}
              />
              <form.AppField
                name="notes"
                children={(field) => (
                  <field.TextField
                    label="Notes"
                    description="Enter the notes"
                  />
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <LoadingButton loading={isPending} type="submit">
              {isEdit ? "View Payment" : "Add Payment"}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


