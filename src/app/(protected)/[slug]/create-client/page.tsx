"use client"

import * as z from "zod"
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z.url("Website must be a valid URL").optional(),
  email: z.email("Email must be a valid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
})

export default function CreateClient() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "Elon Musk",
      email: "elon@Musk.com",
      website: "https://www.spacex.com",
      phone: "+1 123-456-7890",
      address: "123 SpaceX St, Hawthorne, CA 90250",
      gstNumber: "GSTN123456789",
      tags: "VIP, Important, Long-term",
      notes: "This client is a high-profile individual with significant influence in the tech industry. Handle with care and maintain confidentiality.",
    },
  })
  
  const onSubmit = async (data: z.infer<typeof createClientSchema>) => {
    try {
      setLoading(true);
      const tags = data.tags?.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0) || [];
      const clientData = {
        ...data,
        tags: tags,
      }

      console.log("clientData", clientData)

      const res = (
        await api.post<ApiResponse>("/clients", clientData)
      ).data

      form.reset();
      router.push(`/${slug}/clients`)
    } catch (err: unknown) {
      console.log("error ", err)
      if (axios.isAxiosError<ApiResponse>(err)) {
        console.log("Error /clients:", err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }
    

  return (
    <div className=" w-full mx-auto max-w-sm z-1 md:max-w-4xl">
      <div className="flex flex-col gap-6 m-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
        <form className="px-6 md:px-8 " id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Create Client</h1>
              <p className="text-sm text-balance text-muted-foreground">
                Enter the details of the client you want to create.
              </p>
            </div>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Client Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
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
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    defaultValue="john.doe@example.com"
                    required
                  />
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
                  <Input
                    {...field}
                    id="website"
                    type="text"
                    placeholder="https://example.com"
                  />
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
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                  />
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
                  <Input
                    {...field}
                    id="address"
                    type="text"
                    placeholder="123 Main St"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="gstNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gstNumber">GST Number</FieldLabel>
                  <Input
                    {...field}
                    id="gstNumber"
                    type="text"
                    placeholder="GSTN123456789"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags</FieldLabel>
                  <Input
                    {...field}
                    id="tags"
                    type="text"
                    placeholder="Tag1, Tag2, Tag3"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <Input
                    {...field}
                    id="notes"
                    type="text"
                    placeholder="Additional notes"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button form="signup-form" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    Creating client
                    <span className="loading loading-spinner loading-sm"></span>
                  </>
                ) : "Create Client"}
              </Button>
            </Field>  
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
