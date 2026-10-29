"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type ProductPickerOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ProductPickerProps = {
  options: ProductPickerOption[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOptionSelect: (value: string) => void;
  loading?: boolean;
};

export function ProductPicker({
  options,
  searchValue,
  onSearchChange,
  onOptionSelect,
  loading = false,
}: ProductPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Field>
      <FieldLabel>Add product</FieldLabel>

      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            />
          }
        >
          Search products...
          <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-(--anchor-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search products..."
              value={searchValue}
              onValueChange={onSearchChange}
            />

            <CommandList>
              {loading ? (
                <CommandEmpty>Searching products...</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No products found.</CommandEmpty>

                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        disabled={option.disabled}
                        onSelect={() => {
                          onOptionSelect(option.value);
                          setOpen(false);
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
