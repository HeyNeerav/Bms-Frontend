import PageContainer from "@/components/layout/page-container";
import ClientListingPage from "@/features/clients/components/client-listing";
import { searchParamsCache } from "@/lib/searchparams";
import type { SearchParams } from "nuqs/server";
import { ClientFormSheetTrigger } from "@/features/clients/components/client-form-sheet";
import { getBusinessBySlug } from "@/lib/businesses";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Dashboard: Clients",
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function ClientsPage(props: PageProps) {
  const { slug } = await props.params;

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <PageContainer
      pageTitle="Clients"
      pageDescription="Manage clients"
      pageHeaderAction={<ClientFormSheetTrigger />}
    >
      <ClientListingPage businessId={business._id} />
    </PageContainer>
  );
}
