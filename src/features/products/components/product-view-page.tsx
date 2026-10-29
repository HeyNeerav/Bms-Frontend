'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Product } from '../api/types';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { productByIdOptions } from '../api/queries';

type TProductViewPageProps = {
  productId: string;
  businessId: string;
};

export default function ProductViewPage({ productId, businessId }: TProductViewPageProps) {
  if (productId === 'new') {
    return <ProductForm initialData={null} pageTitle='Create New Product' />;
  }

  return <EditProductView productId={productId} businessId={businessId} />;
}

function EditProductView({ productId, businessId }: { productId: string; businessId: string }) {


  const { data } = useSuspenseQuery(productByIdOptions(businessId, productId));

  if (!data?.success || !data?.product) {
    notFound();
  }

  return <ProductForm initialData={data.product as Product} pageTitle='Edit Product' />;
}
