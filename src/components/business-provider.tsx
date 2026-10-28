"use client";

import { createContext, useContext } from "react";

type BusinessRole = "OWNER" | "ADMIN" | "EMPLOYEE";

type Business = {
  _id: string;
  name: string;
  slug: string;
  logo?: {
    url?: string | undefined;
    publicId?: string | undefined;
  },
  role: BusinessRole;
};

const BusinessContext = createContext<Business | null>(null);

export function BusinessProvider({
  business,
  children,
}: {
  business: Business;
  children: React.ReactNode;
}) {
  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const business = useContext(BusinessContext);

  if (!business) {
    throw new Error("useBusiness must be used within BusinessProvider");
  }

  return business;
}