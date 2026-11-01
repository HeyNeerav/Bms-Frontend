import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMS Dashboard - Businesses",
  description: "Your businesses on the BMS Dashboard",
};

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {children}
    </main>
  );
}
