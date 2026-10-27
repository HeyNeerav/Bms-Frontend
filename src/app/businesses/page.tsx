"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  Plus,
  Search,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

type Business = {
  _id: string;
  name: string;
  role: string;
  slug: string;
};

function BusinessCard({ business }: { business: Business }) {
  return (
    <Card className="rounded-xl border-border/80 bg-card/85 shadow-none transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <BriefcaseBusiness className="size-7" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold tracking-tight text-foreground">
                  {business.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {business.slug}
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Role</span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {business.role}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const res: { data: Business[] } = await apiClient.get("/businesses");
      setBusinesses(res.data);
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(
    () =>
      businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.slug.includes(query.toLowerCase()),
      ),
    [businesses, query],
  );

  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-10 pt-14 lg:px-20 lg:pt-16">
      <div className="relative overflow-hidden pb-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Your businesses, all in one place.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">
            Manage your businesses, switch between them, or create a new one to
            get started.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 bottom-0 hidden h-44 w-[45%] text-primary/80 lg:block"
        >
          <div className="absolute bottom-1 left-0 right-0 border-b-2 border-blue-900/70" />
          <div className="absolute bottom-2 left-[34%] h-24 w-20 border-2 border-blue-900/70 bg-background/50" />
          <div className="absolute bottom-2 left-[35.5%] h-8 w-5 border-2 border-blue-900/60 bg-blue-50" />
          <div className="absolute bottom-2 left-[57%] h-16 w-24 border-2 border-blue-900/70 bg-background/50" />
          <div className="absolute bottom-2 left-[61%] h-8 w-5 border-2 border-blue-900/60 bg-blue-50" />
          <div className="absolute bottom-2 left-[8%] h-16 w-16 rounded-t-full bg-emerald-200/70" />
          <div className="absolute bottom-2 left-[75%] h-20 w-10 rounded-full bg-emerald-200/70" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/75 p-4 shadow-[0_16px_55px_rgba(30,64,175,0.06)] backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search businesses"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search businesses..."
              className="h-12 rounded-xl border-border pl-12 text-base shadow-none"
            />
          </div>
          <Button
            onClick={() => router.push("/businesses/create")}
            className="h-12 rounded-xl bg-primary px-6 font-semibold hover:bg-primary/90"
          >
            <Plus data-icon="inline-start" />
            Create Business
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
        {filteredBusinesses.length === 0 && (
          <Card className="rounded-xl border-dashed border-border bg-transparent shadow-none">
            <CardContent className="flex min-h-[228px] flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
                <Plus className="size-7" />
              </div>
              <h2 className="font-semibold">Create a new business</h2>
              <p className="mt-1 max-w-[220px] text-sm leading-5 text-muted-foreground">
                Set up a new business and start managing it with your team.
              </p>
              <Button
                onClick={() => router.push("/businesses/create")}
                className="mt-3 rounded-xl bg-primary px-6 hover:bg-primary/90"
              >
                Create Business
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl bg-muted/60 p-4 sm:flex-row sm:px-6">
          <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
            <Mail className="size-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-semibold">Have an invitation?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Join an existing business using an invitation link.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-xl border-border bg-background px-6 font-semibold"
          >
            <UserRoundPlus data-icon="inline-start" />
            Join with invitation
          </Button>
        </div>
      </div>
    </section>
  );
}
