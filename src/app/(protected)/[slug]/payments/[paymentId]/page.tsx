import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { paymentByIdOptions } from "@/features/payments/api/queries";
import PageContainer from "@/components/layout/page-container";
import { getBusinessBySlug } from "@/lib/businesses";
import { notFound } from "next/navigation";
import PaymentViewPage from "@/features/payments/components/payment-view-page";

export const metadata = {
  title: "Dashboard : Payment View",
};

type PageProps = { params: Promise<{ slug: string; paymentId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  if (params.paymentId !== "new") {
    void queryClient.query(
      paymentByIdOptions(business._id, params.paymentId),
    );
  }

  return (
    <PageContainer>
      <div className="flex-1 space-y-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PaymentViewPage
            businessId={business._id}
            paymentId={params.paymentId}
          />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
