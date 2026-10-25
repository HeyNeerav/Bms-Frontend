"use client";

import { useState } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { ApiResponse } from "@/types/ApiResponse";

import axios from "axios";
import { api } from "@/lib/api";

import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

import { Plus } from "lucide-react";

const createBusinessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  website: z.string("Website must be a valid URL").optional(),
  email: z.union([
      z.email("Email must be a valid email address"),
      z.literal(""),
    ])
    .transform((value) => value === "" ? undefined : value),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export function CreateBusinessForm(
  { setRefreshKey }: { setRefreshKey: React.Dispatch<React.SetStateAction<number>> }
) {
  const [open, setOpen] = useState(false);
  const form = useForm<
    z.input<typeof createBusinessSchema>,
    unknown,
    z.output<typeof createBusinessSchema>
    >({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      email: "",
      phone: "",
      address: "",
    },
  })
  
  const onSubmit = async (data: z.infer<typeof createBusinessSchema>) => {
    try {
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key, 
            value === "" ? undefined : value
          ])
        );
      const res = (
        await api.post<ApiResponse>("/businesses", cleanedData)
      ).data

      console.log("Response", res)
      setRefreshKey((prev) => prev + 1);

    } catch (err: unknown) {
      console.log("/businesses error", err)
      if (axios.isAxiosError<ApiResponse>(err)) {
        console.log("Error /businesses:", err.response?.data.message);
      }
    } finally {
      setOpen(false);
      form.reset(); 
    }
  }
    

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="create-business-form" onSubmit={form.handleSubmit(onSubmit)} >
        <DialogTrigger asChild>
          <Button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white">
            Create New
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm md:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Business</DialogTitle>
            <DialogDescription>
              Fill in the details for your new business.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Name<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input {...field} id="name" name="name" placeholder="My Business" required/>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea {...field} id="description" name="description" placeholder="Describe your business"/>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input {...field} id="email" name="email" type="email" placeholder="business@example.com" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input {...field} id="phone" name="phone" type="tel" placeholder="(123) 456-7890" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input {...field} id="address" name="address" placeholder="123 Main Street" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="website"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="website">Website</FieldLabel>
                  <Input {...field} id="website" name="website" type="url" placeholder="https://www.example.com" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              form.reset();
              setOpen(false);
            }}>
              Cancel
            </Button>
            <Button form="create-business-form" type="submit">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
