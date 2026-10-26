"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useSelector } from "@tanstack/react-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { useAppForm } from "@/lib/form";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export const signInSchema = z.object({
  identifier: z.union([
    z.email("Invalid email address"),
    z
      .string()
      .min(4, "Username must be at least 4 characters")
      .regex(/^[^@]+$/, "Username cannot contain an '@' symbol"),
  ]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      identifier: "john.doe@example.com",
      password: "password123",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await apiClient.post("/auth/login", {
          identifier: value.identifier,
          password: value.password,
        });

        router.push("/dashboard/overview");

        toast("You are logged in", {
          description: "Welcome back, you have successfully logged in.",
          closeButton: true,
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
      } catch (error) {
        toast.error("Invalid credentials. Please try again.", {
          description:
            "The email/username or password you entered is incorrect.",
          closeButton: true,
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
      }
    },
  });

  const isSubmitting = useSelector(form.store, (s) => s.isSubmitting);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-in-form"
            aria-busy={isSubmitting}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <form.AppField
                name="identifier"
                children={(field) => (
                  <field.TextField
                    label="Email or username"
                    required
                    placeholder="m@example.com"
                  />
                )}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField
                    label="Password"
                    required
                    type="password"
                    placeholder="Min 8 characters"
                  />
                )}
              />
              <Field>
                <div className="flex items-center">
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </Field>
              <Field>
                <form.AppForm>
                  <form.SubmitButton>Submit</form.SubmitButton>
                </form.AppForm>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/auth/sign-up">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
