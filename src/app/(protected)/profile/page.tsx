import PageContainer from "@/components/layout/page-container";
import ProfileForm from "@/features/profile/component/profile-form";

export default async function Page() {

  return (
    <PageContainer
      pageTitle="Profile Settings"
      pageDescription="Manage your profile settings, including personal information and account security."
    > 
      <ProfileForm />
    </PageContainer>
  );
}
