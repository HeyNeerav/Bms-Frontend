import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { productInfoContent } from "@/config/infoconfig";
import { getBusinessBySlug } from "@/lib/businesses";
import { notFound } from "next/navigation";
import PaymentListingPage from "@/features/payments/components/payment-listing";

export const metadata = {
  title: "Dashboard: Payments",
};

type pageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const { slug } = await props.params;

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <PageContainer
      pageTitle="Payments"
      pageDescription="Manage payments."
      pageHeaderAction={
        <Link
          href="payments/new"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <Icons.add className="mr-2 h-4 w-4" /> Add New
        </Link>
      }
    >
      <PaymentListingPage businessId={business._id} />
    </PageContainer>
  );
}
