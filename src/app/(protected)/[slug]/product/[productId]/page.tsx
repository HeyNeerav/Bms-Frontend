import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { productByIdOptions } from '@/features/products/api/queries';
import PageContainer from '@/components/layout/page-container';
import ProductViewPage from '@/features/products/components/product-view-page';
import { getBusinessBySlug } from '@/lib/businesses';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Dashboard : Product View'
};

type PageProps = { params: Promise<{ slug: string, productId: string }> };

export default async function Page(props: PageProps) {

  const params = await props.params;
  const queryClient = getQueryClient();

  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }

  if (params.productId !== 'new') {
    void queryClient.query(productByIdOptions(business._id, params.productId));
  }

  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductViewPage businessId={business._id} productId={params.productId} />
        </HydrationBoundary>
      </div>
    </PageContainer>
  );
}
