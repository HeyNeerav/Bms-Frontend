"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import {
  invoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createInvoiceMutation, updateInvoiceMutation } from "../api/mutations";
import type { Invoice } from "../api/types";
import { useBusiness } from "@/components/business-provider";
import { usersQueryOptions } from "@/features/clients/api/queries";
import { useEffect, useState } from "react";
import { productsQueryOptions } from "@/features/products/api/queries";
import { ProductPicker } from "@/components/forms/product-picker";
import { InvoiceItems } from "./invoice-items";
import { ApiError } from "@/lib/api";


type SelectedProduct = {
  _id: string;
  name: string;
  price: number;
};

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export default function InvoiceForm({
  initialData,
  pageTitle,
}: {
  initialData: Invoice | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;
  const business = useBusiness();

  const createMutation = useMutation({
    ...createInvoiceMutation,
    onSuccess: () => {
      toast.success("Invoice created");
      router.push(`/${business?.slug}/invoices`);
    },
    onError: (error: any) => {
      toast.error("Couldn't create invoice. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const updateMutation = useMutation({
    ...updateInvoiceMutation,
    onSuccess: () => {
      toast.success("Invoice updated");
      router.push(`/${business?.slug}/invoices`);
    },
    onError: (error: any) => {
      toast.error("Couldn't update invoice. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      clientId: initialData?.client ?? "",
      items: (initialData?.items ?? []) as InvoiceFormValues["items"],
      discount: initialData?.discount ?? 0,
      tax: initialData?.tax ?? 0,
      notes: initialData?.notes ?? "",
      dueDate: initialData?.dueDate ?? undefined,
    } as InvoiceFormValues,
    validators: {
      onSubmit: invoiceSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        clientId: value.clientId,
        items: value.items,
        discount: value.discount,
        tax: value.tax,
        notes: value.notes,
        dueDate: value.dueDate ? new Date(value.dueDate) : undefined,
      };
      const businessId = business?._id;

      if (isEdit) {
        updateMutation.mutate({
          businessId,
          id: initialData._id,
          values: payload,
        });
      } else {
        createMutation.mutate({ businessId, data: payload });
      }
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const [clientSearch, setClientSearch] = useState("");
  const debouncedClientSearch = useDebouncedValue(clientSearch, 300);

  const { data: clientQueryData, isLoading: isClientLoading } = useQuery(
    usersQueryOptions(business._id, {search: debouncedClientSearch}),
  );

  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebouncedValue(productSearch, 300);

  const { data: productQueryData, isLoading: isProductLoading } = useQuery(
    productsQueryOptions(business._id, { search: debouncedProductSearch }),
  );


  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, SelectedProduct>
  >({});

  const addProduct = (productId: string) => {
    const product = productQueryData?.products?.find(
      (product) => product._id === productId,
    );

    if (!product) return;

    setSelectedProducts((previous) => ({
      ...previous,
      [productId]: {
        _id: product._id,
        name: product.name,
        price: product.price,
      },
    }));

    const items = form.getFieldValue("items");
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      form.setFieldValue(
        "items",
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      form.pushFieldValue("items", { productId, quantity: 1 });
    }

    setProductSearch("");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    form.setFieldValue(
      "items",
      form.getFieldValue("items").map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeProduct = (productId: string) => {
    form.setFieldValue(
      "items",
      form.getFieldValue("items").filter(
        (item) => item.productId !== productId,
      ),
    );
  };

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
            <div className="">
              <form.AppField
                name="clientId"
                children={(field) => (
                  <field.ComboboxField
                    label="Client"
                    placeholder="Select a client"
                    searchPlaceholder="Search clients..."
                    searchValue={clientSearch}
                    onSearchChange={setClientSearch}
                    loading={isClientLoading}
                    required
                    options={
                      clientQueryData?.users?.map((user) => ({
                        value: user._id,
                        label: user.name,
                      })) || []
                    }
                  />
                )}
              />
            </div>
            <div className="space-y-4">    
              <ProductPicker
                options={
                  productQueryData?.products?.map((product) => ({
                    value: product._id,
                    label: `${product.name} — ${product.price}`,
                  })) ?? []
                }
                searchValue={productSearch}
                onSearchChange={setProductSearch}
                loading={isProductLoading}
                onOptionSelect={addProduct}
              />
              <form.Subscribe selector={(state) => state.values.items}>
                {(items) => (
                  <InvoiceItems
                    items={items}
                    products={selectedProducts}
                    onQuantityChange={updateQuantity}
                    onRemove={removeProduct}
                  />
                )}
              </form.Subscribe>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <form.AppField
                name="discount"
                children={(field) => (
                  <field.TextField
                    type="number"
                    min={0}
                    step={0.01}
                    label="Discount"
                    description="Enter the discount amount"
                  />
                )}
              />
              <form.AppField
                name="tax"
                children={(field) => (
                  <field.TextField
                    type="number"
                    min={0}
                    step={0.01}
                    label="Tax"
                    description="Enter the tax amount"
                  />
                )}
              />

              <form.AppField
                name="dueDate"
                children={(field) => (
                  <field.DatePickerField
                    label="Due Date"
                    description="Select the due date"
                  />
                )}
              />
            </div>
            <form.AppField
              name="notes"
              children={(field) => (
                <field.TextField label="Notes" description="Enter the notes" />
              )}
            />
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
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
