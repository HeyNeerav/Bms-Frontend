"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-button";
import { useAppForm } from "@/lib/form";
import { ApiError } from "@/lib/api";

import { updateAvatarMutation } from "../api/mutations";
import type { User } from "../api/types";
import { userKeys } from "../api/queries";
import { ProfileImageFormValues, profileImageSchema } from "../schemas/profile";

export function ProfileImageForm({ initialData }: { initialData: User }) {
  const queryClient = useQueryClient();

  const imageMutation = useMutation({
    ...updateAvatarMutation,
    onSuccess: () => {
      toast.success("Profile picture updated");
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
    onError: (error: any) => {
      toast.error("Couldn't update profile picture", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      imageUrl: [] as File[],
    } as ProfileImageFormValues,
    validators: {
      onSubmit: profileImageSchema,
    },
    onSubmit: ({ value }) => {
      const { imageUrl } = profileImageSchema.parse(value);

      const image = imageUrl?.[0];

      if (!image) {
        toast.error("Please select an image");
        return;
      }

      imageMutation.mutate(image);
    },
  });

  const initials = initialData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage
                src={initialData.avatar?.url ?? undefined}
                alt={initialData.name}
              />
              <AvatarFallback className="text-xl">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <p className="font-medium">{initialData.name}</p>
              <p className="text-sm text-muted-foreground">
                Your profile picture
              </p>
            </div>
          </div>

          <FieldGroup>
            <form.AppField
              name="imageUrl"
              children={(field) => (
                <field.FileUploadField
                  label="Upload New Picture"
                  description="JPG, PNG or WebP. Maximum size 5 MB."
                  maxSize={5 * 1024 * 1024}
                  maxFiles={1}
                />
              )}
            />
          </FieldGroup>

          <div className="flex justify-end">
            <LoadingButton loading={imageMutation.isPending} type="submit">
              Update Picture
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
