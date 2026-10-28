"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";


export default function BusinessSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Business created successfully | BMS";
  }, []);

  return (

    <section className="relative flex mx-auto w-full max-w-[1440px] flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <Confetti
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        options={{
          origin: {y: 0.7},
        }}
      />
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <div className="mb-7 grid size-20 place-items-center rounded-full bg-primary/10 text-primary shadow-sm">
          <Check className="size-10" strokeWidth={2.5} />
        </div>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          You’re all set
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Business created successfully!
        </h1>
        <p className="mt-4 max-w-md leading-7 text-muted-foreground">
          Acme Retail is ready to use. You can now start managing your
          business and invite your team members.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => router.push("/businesses")} className="min-w-32">
            Go to business
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            onClick={() => router.push("/businesses/create")}
            variant="outline"
            className="min-w-40"
          >
            Create another business
          </Button>
        </div>
      </div>
    </section>
  );
}
