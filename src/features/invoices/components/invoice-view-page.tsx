'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Invoice } from '../api/types';
import { notFound } from 'next/navigation';
import InvoiceForm from './invoice-form';
import { invoiceByIdOptions } from '../api/queries';

type TInvoiceViewPageProps = {
  invoiceId: string;
  businessId: string;
};

export default function InvoiceViewPage({ invoiceId, businessId }: TInvoiceViewPageProps) {
  if (invoiceId === 'new') {
    return <InvoiceForm initialData={null} pageTitle='Create New Invoice' />;
  }

  return <EditInvoiceView invoiceId={invoiceId} businessId={businessId} />;
}

function EditInvoiceView({ invoiceId, businessId }: { invoiceId: string; businessId: string }) {


  const { data } = useSuspenseQuery(invoiceByIdOptions(businessId, invoiceId));

  if (!data?.success || !data?.invoice) {
    notFound();
  }

  return <InvoiceForm initialData={data.invoice as Invoice} pageTitle='Edit Invoice' />;
}
