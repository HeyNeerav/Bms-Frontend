"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { InvoiceFormValues } from "@/features/invoices/schemas/invoice";

type Product = {
  _id: string;
  name: string;
  price: number;
};

type InvoiceItemsProps = {
  items: InvoiceFormValues["items"];
  products: Record<string, Product>;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export function InvoiceItems({
  items,
  products,
  onQuantityChange,
  onRemove,
}: InvoiceItemsProps) {
  return (
    <div className="space-y-3">

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No products added yet.
        </p>
      ) : (
        <div className="divide-y rounded-md border">
          {items.map((item) => {
            const product = products[item.productId];

            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.price.toFixed(2)} × {item.quantity} ={" "}
                    {(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      onQuantityChange(
                        item.productId,
                        item.quantity - 1,
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span>{item.quantity}</span>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onQuantityChange(
                        item.productId,
                        item.quantity + 1,
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}