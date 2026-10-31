import PageContainer from "@/components/layout/page-container";
import { MemberFormSheetTrigger } from "@/features/members/components/member-form-dialog";
import MemberListingPage from "@/features/members/components/member-listing";
import { getBusinessBySlug } from "@/lib/businesses";
import { searchParamsCache } from "@/lib/searchparams";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs/server";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const business = await getBusinessBySlug(slug);

  if (!business) { 
    notFound();
  }

  return (
    <PageContainer
      pageTitle="Business Members"
      pageDescription={`Manage who can access ${business?.name || "this business"} and what they can do.`}
      pageHeaderAction={<MemberFormSheetTrigger />}
    >
      <MemberListingPage businessId={business?._id} />
    </PageContainer>
  );
}
