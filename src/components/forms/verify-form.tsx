"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "@tanstack/react-form";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAppForm } from "@/lib/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { ApiError } from "@/lib/api-error";

export const verifySchema = z.object({
  email: z.email("Invalid email address"),
  verificationCode: z.string().length(6, "Verification code must be 6 characters"),
});

const RESEND_DELAY = 30;

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const form = useAppForm({
    validators: {
      onSubmit: verifySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await apiClient.post("/auth/verify", value);

        toast.success("Account verified!", {
          description: "Your account has been verified successfully.",
        });

        router.push("/auth/sign-in");
      } catch (error) {
        toast.error("Failed to verify account", {
          description:
            error instanceof Error || error instanceof ApiError
              ? error.message
              : "Unknown error",
        });
      }
    },
  });

  const email = useSelector(
    form.store,
    (state) => (state.values as { email?: string }).email,
  );

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  useEffect(() => {
    const getPendingEmail = async () => {
      try {
        const { data } = await apiClient.get<{ data: { email: string } }>(
          "/auth/verify/pending-email",
        );

        if (data.email) {
          form.setFieldValue("email", data.email);
        }
      } catch {
      } finally {
        setIsLoadingEmail(false);
      }
    };

    getPendingEmail();
  }, [form]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const sendVerificationCode = async () => {
    const result = z.email().safeParse(email);

    if (!result.success) {
      toast.error("Enter a valid email address");
      return;
    }

    setIsSending(true);

    try {
      await apiClient.post("/auth/verify/send", {
        email: result.data,
      });

      setIsCodeSent(true);
      setCountdown(RESEND_DELAY);

      toast.success("Verification code sent", {
        description: `Check your inbox at ${email}.`,
      });
    } catch (error) {
      toast.error("Failed to send verification code", {
        description:
          error instanceof Error || error instanceof ApiError
            ? error.message
            : "Unknown error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription>
            Verify your email address to finish creating your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="verify-form"
            aria-busy={isSubmitting || isSending || isLoadingEmail}
            onSubmit={(event) => {
              event.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="EMAIL"
                    type="email"
                    required
                    disabled={isLoadingEmail || isCodeSent || isSending}
                  />
                )}
              />

              {!isCodeSent ? (
                <Button
                  type="button"
                  className="w-full"
                  disabled={isLoadingEmail || isSending || !email?.trim()}
                  onClick={sendVerificationCode}
                >
                  {isLoadingEmail ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Checking email...
                    </>
                  ) : isSending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      <MailCheck />
                      Send verification code
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <FieldDescription>
                      Code sent to <strong>{email}</strong>
                    </FieldDescription>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSending || countdown > 0}
                      onClick={sendVerificationCode}
                    >
                      {isSending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <RefreshCw />
                      )}
                      {countdown > 0
                        ? `Resend in ${formatCountdown(countdown)}`
                        : "Resend code"}
                    </Button>
                  </div>

                  <form.AppField
                    name="verificationCode"
                    children={(field) => (
                      <field.OtpField label="VERIFICATION CODE" required />
                    )}
                  />

                  <Field>
                    <form.AppForm>
                      <form.SubmitButton>
                        {isSubmitting ? "Verifying..." : "Verify account"}
                      </form.SubmitButton>
                    </form.AppForm>
                  </Field>
                </>
              )}

              <FieldDescription className="text-center">
                Already verified?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
