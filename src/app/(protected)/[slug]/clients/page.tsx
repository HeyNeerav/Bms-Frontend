"use client";

import { useEffect, useState } from "react"
import { ClientsTable } from "./_components/ClientsTable";
import { useParams, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";


export default function Clients() {
  const { slug } = useParams();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-8">
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
              </div>
              <div>
                <Link className="bg-blue-500 shadow-theme-xs hover:bg-blue-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition" href={`/${slug}/create-client`}>
                  <Plus />
                  Create a Client
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
              <div className="border-b p-5 sm:border-r lg:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Overdue</p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">$120.80</h3>
              </div>
              <div className="border-b p-5 lg:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Due within next 30 days</p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">0.00</h3>
              </div>
              <div className="border-b p-5 sm:border-r sm:border-b-0">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Average time to get paid</p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">24 days</h3>
              </div>
              <div className="p-5">
                <p className="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Upcoming Payout</p>
                <h3 className="text-3xl text-gray-800 dark:text-white/90">$3,450.50</h3>
              </div>
            </div>
          </div>
          <ClientsTable/>
        </div>
      </div>
    </div>

  )
}



