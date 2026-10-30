"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import { typeOptions } from "@/features/products/constants/product-options";
import {
  productSchema,
  type ProductFormValues,
} from "@/features/products/schemas/product";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProductMutation, updateProductMutation } from "../api/mutations";
import type { Product } from "../api/types";
import { useBusiness } from "@/components/business-provider";
import { ApiError } from "@/lib/api";

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;
  const business = useBusiness();

  const createMutation = useMutation({
    ...createProductMutation,
    onSuccess: () => {
      toast.success("Product created");
      router.push(`/${business?.slug}/product`);
    },
    onError: (error: any) => {
      toast.error("Couldn't create product. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const updateMutation = useMutation({
    ...updateProductMutation,
    onSuccess: () => {
      toast.success("Product updated");
      router.push(`/${business?.slug}/product`);
    },
    onError: (error: any) => {
      toast.error("Couldn't update product. Try again.", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      imageUrl: undefined,
      name: initialData?.name ?? "",
      price: initialData?.price || 0,
      type: initialData?.type ?? "PRODUCT",
      stockQuantity: initialData?.stockQuantity ?? 0,
      sku: initialData?.sku ?? undefined,
      category: initialData?.category ?? undefined,
      description: initialData?.description ?? undefined,
    } as ProductFormValues,
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = productSchema.parse(value);

      const payload = {
        ...parsed,
        imageUrl: value.imageUrl?.[0] ?? undefined,
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
              name="imageUrl"
              children={(field) => (
                <field.FileUploadField
                  label="Product Image"
                  description="Upload a product image"
                  maxSize={5 * 1024 * 1024}
                  maxFiles={1}
                />
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Product Name"
                    required
                    placeholder="Enter product name"
                  />
                )}
              />

              <form.AppField
                name="price"
                children={(field) => (
                  <field.TextField
                    label="Price"
                    required
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Enter price"
                  />
                )}
              />

              <form.AppField
                name="stockQuantity"
                children={(field) => (
                  <field.TextField
                    label="Stock Quantity"
                    required
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Enter stock"
                  />
                )}
              />

              <form.AppField
                name="sku"
                children={(field) => (
                  <field.TextField label="SKU" placeholder="Enter SKU" />
                )}
              />

              <form.AppField
                name="type"
                children={(field) => (
                  <field.SelectField
                    label="Type"
                    required
                    options={typeOptions}
                    placeholder="Select Type"
                  />
                )}
              />

              <form.AppField
                name="category"
                children={(field) => (
                  <field.TextField
                    label="Category"
                    placeholder="Select category"
                  />
                )}
              />
            </div>

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextareaField
                  label="Description"
                  placeholder="Enter product description"
                  maxLength={500}
                  rows={4}
                />
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
              {isEdit ? "Update Product" : "Add Product"}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
