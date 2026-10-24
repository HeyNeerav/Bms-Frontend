"use client"

import { useState } from 'react'
import Image from "next/image"
import * as z from "zod";
import axios from 'axios'
import { Controller, useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/api";
import { ApiResponse } from "@/types/ApiResponse";
import { loginSchema } from "@/schemas/loginSchema"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { useRouter } from 'next/navigation';


export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "john.doe@example.com",
      password: "password123",
    },
  })
 
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const res = (
        await api.post<ApiResponse>("/auth/login", data)
      ).data
      router.push("/home");

    } catch (err: unknown) {
      if (axios.isAxiosError<ApiResponse>(err)) {
        console.log("Error Message", err.response?.data.message);
      }
    }
    finally {
      setLoading(false);
      form.reset()
    }
  }
  
  return (
    <div className="flex relative min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Image
        src="/images/bg1.jpg"
        alt="Background"
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover h-full w-full"
      />
      <div className="w-full z-1 max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form id="login-form" className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Acme Inc account
                    </p>
                  </div>
                  <Controller
                    name="identifier"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="identifier">Email or Username</FieldLabel>
                        <Input
                          {...field}
                          id="identifier"
                          type="text"
                          placeholder="m@example.com or john_doe"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        <FieldDescription>
                          You can use either your email or username to log in
                        </FieldDescription>
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <a
                            href="/forgot-password"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <div className="relative">
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          Logging in
                          <span className="loading loading-spinner loading-sm"></span>
                        </>
                      ) : "Login"}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or 
                  </FieldSeparator>
                    <Field>
                      <Button variant="outline" type="button">
                        <Image src="/logos/google.svg" alt="Google" width={24} height={24} />
                        <span>Sign in with Google</span>
                      </Button>
                    </Field>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="/signup">Sign up</a>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/images/login.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}
