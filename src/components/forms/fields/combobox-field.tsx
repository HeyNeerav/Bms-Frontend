"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  useFieldContext,
  useFieldInvalid,
  type BaseFieldProps,
} from "@/lib/form-context";

type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type ComboboxFieldProps = BaseFieldProps & {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchValue?: string;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
  onOptionSelect?: (value: string) => void;
};

export function ComboboxField({
  label,
  description,
  required,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  searchValue,
  onSearchChange,
  loading = false,
  onOptionSelect,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = useFieldInvalid();
  const [open, setOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState("");

  const selected = options.find((o) => o.value === field.state.value);
  const listboxId = `${field.name}-listbox`;

  const search = searchValue ?? localSearch;
  const handleSearchChange = onSearchChange ?? setLocalSearch;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {required && " *"}
      </FieldLabel>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            field.handleBlur();
            handleSearchChange("");
          }
        }}
      >
        <PopoverTrigger
          render={
            <Button
              id={field.name}
              variant="outline"
              role="combobox"
              aria-controls={listboxId}
              aria-expanded={open}
              aria-invalid={isInvalid}
              aria-describedby={isInvalid ? `${field.name}-error` : undefined}
              className={cn(
                "w-full justify-between font-normal",
                !selected && "text-muted-foreground",
              )}
            />
          }
        >
          <span className="truncate">
            {selected?.label ?? placeholder}
          </span>
          <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-(--anchor-width) p-0">
          <Command shouldFilter={!onSearchChange}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={handleSearchChange}
            />

            <CommandList id={listboxId}>
              {loading ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}

              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    keywords={[opt.label, opt.description ?? ""]}
                    onSelect={() => {
                      onOptionSelect?.(opt.value);
                      field.handleChange(opt.value);
                      setOpen(false);
                      handleSearchChange("");
                    }}
                  >
                    <Icons.check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        field.state.value === opt.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{opt.label}</span>
                      {opt.description && (
                        <span className="truncate text-xs text-muted-foreground">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && (
        <FieldError
          id={`${field.name}-error`}
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
}