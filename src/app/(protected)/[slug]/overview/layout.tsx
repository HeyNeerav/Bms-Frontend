import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMS Dashboard",
  description: "Business Management System Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};
  
export default async function OverViewLayout({
  children
}: {
  children: React.ReactNode;
}) {
  
  return children;
}
