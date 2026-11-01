"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import { ApiError } from "@/lib/api";

import { NameFormValues, nameSchema } from "../schemas/profile";
import { updateProfileMutation } from "../api/mutations";
import type { User } from "../api/types";
import { userKeys } from "../api/queries";
import { Input } from "@/components/ui/input";

export function ProfileForm({ initialData }: { initialData: User }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    ...updateProfileMutation,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error: any) => {
      toast.error("Couldn't update profile", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: initialData.name ?? "",
    } as NameFormValues,
    validators: {
      onSubmit: nameSchema,
    },
    onSubmit: ({ value }) => {
      const { name } = nameSchema.parse(value)
      updateMutation.mutate(name);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
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
                  label="Full Name"
                  required
                  placeholder="Enter your name"
                />
              )}
            />
             <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={initialData.email} disabled />
              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input value={initialData.username} disabled />
              <p className="text-xs text-muted-foreground">
                Your username cannot be changed here.
              </p>
            </div>
          </FieldGroup>

          <div className="flex justify-end">
            <LoadingButton loading={updateMutation.isPending} type="submit">
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}