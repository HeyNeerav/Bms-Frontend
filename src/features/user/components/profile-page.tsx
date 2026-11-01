"use client";

import type { User } from "../api/types";

import { ProfileForm } from "./profile-form";
import { ProfileImageForm } from "./profile-image-form";
import { PrivacySecurity } from "./privacy-security";
import PageContainer from "@/components/layout/page-container";
import { userMeQueryOptions } from "../api/queries";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const { data } = useQuery(userMeQueryOptions());
  const user = data?.data;
  
  if (!user) {
    return (
      <PageContainer
        pageTitle="Profile Settings"
        pageDescription="Manage your profile settings, including personal information and account security."
      >
        <p className="text-sm text-muted-foreground">
          Unable to load user profile. Please try again later.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle="Profile Settings"
      pageDescription="Manage your profile settings, including personal information and account security."
    > 
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <ProfileImageForm initialData={user} />
        <ProfileForm initialData={user} />
        <PrivacySecurity user={user} />
      </div>
    </PageContainer>
  );
}