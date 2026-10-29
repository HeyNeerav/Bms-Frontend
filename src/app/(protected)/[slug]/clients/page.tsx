

import PageContainer from '@/components/layout/page-container';
import UserListingPage from '@/features/clients/components/user-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import { usersInfoContent } from '@/features/clients/info-content';
import { UserFormSheetTrigger } from '@/features/clients/components/user-form-sheet';
import { getBusinessBySlug } from '@/lib/businesses';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Dashboard: Clients'
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {
  const { slug } = await props.params

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <PageContainer
      pageTitle='Clients'
      pageDescription='Manage clients'
      infoContent={usersInfoContent}
      pageHeaderAction={<UserFormSheetTrigger />}
    >
      <UserListingPage businessId={business._id} />
    </PageContainer>
  );
}
