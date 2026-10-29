import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { invoiceByIdOptions } from "@/features/invoices/api/queries";
import PageContainer from "@/components/layout/page-container";
import { getBusinessBySlug } from "@/lib/businesses";
import { notFound } from "next/navigation";
import InvoiceViewPage from "@/features/invoices/components/invoice-view-page";

export const metadata = {
  title: "Dashboard : Invoice View",
};

type PageProps = { params: Promise<{ slug: string; invoiceId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  if (params.invoiceId !== "new") {
    void queryClient.prefetchQuery(
      invoiceByIdOptions(business._id, params.invoiceId),
    );
  }

  return (
    <PageContainer>
      <div className="flex-1 space-y-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InvoiceViewPage
            businessId={business._id}
            invoiceId={params.invoiceId}
          />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
