'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { Payment } from '../api/types';
import { notFound } from 'next/navigation';
import PaymentForm from './payment-form';
import { paymentByIdOptions } from '../api/queries';

type TPaymentViewPageProps = {
  paymentId: string;
  businessId: string;
};

export default function PaymentViewPage({ paymentId, businessId }: TPaymentViewPageProps) {
  if (paymentId === 'new') {
    return <PaymentForm initialData={null} pageTitle='Create New Payment' />;
  }

  return <EditPaymentView paymentId={paymentId} businessId={businessId} />;
}

function EditPaymentView({ paymentId, businessId }: { paymentId: string; businessId: string }) {


  const { data } = useSuspenseQuery(paymentByIdOptions(businessId, paymentId));

  if (!data?.success || !data?.payment) {
    notFound();
  }

  return <PaymentForm initialData={data.payment as Payment} pageTitle='View Payment' />;
}
