"use client";

import { revalidateLogic, useSelector } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { useAppForm } from "@/lib/form";
import { useFormStepper } from "@/hooks/use-stepper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseBusiness, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

const businessFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  email: z.string("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .regex(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
      "Please enter a valid website address",
    )
    .optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const stepSchemas = [
  // Step 1: Basic Info
  businessFormSchema.pick({ name: true, email: true, phone: true }),
  // Step 2: Details
  businessFormSchema.pick({ website: true, address: true, description: true }),
  // Step 3: Review (no validation)
  z.object({}),
];

const steps = ["Basic Info", "Details", "Review"];

function ReviewSummary({
  values,
}: {
  values: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    description: string;
  };
}) {
  return (
    <div className="space-y-3">
      <Separator />
      <div className="grid gap-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Name
          </p>
          <p className="text-sm">{values.name || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Email
          </p>
          <p className="text-sm capitalize">{values.email || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Phone
          </p>
          <p className="text-sm">{values.phone || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Website
          </p>
          <p className="text-sm">{values.website || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Address
          </p>
          <p className="text-sm">{values.address || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Description
          </p>
          <p className="text-sm">{values.description || "—"}</p>
        </div>
      </div>
    </div>
  );
}

// --- Main Form ---

type BusinessFormValues = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  description: string;
};

export default function CreateBusinessForm() {
  const router = useRouter();

  const {
    currentValidator,
    step,
    currentStep,
    isFirstStep,
    handleCancelOrBack,
    handleNextStepOrSubmit,
  } = useFormStepper(stepSchemas, { fullSchema: businessFormSchema });

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      description: "",
    } as BusinessFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: currentValidator as typeof businessFormSchema,
      onDynamicAsyncDebounceMs: 500,
    },
    onSubmit: async ({ value }) => {
      try {
        await apiClient.post("/businesses", value);
        router.push("/businesses/success");
        toast.success("Business created successfully!", {
          description: "Your new business has been created.",
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
        toast.error("Failed to create business. Please try again.", {
          description: "An error occurred while creating the business.",
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

  const isDefault = useSelector(form.store, (state) => state.isDefaultValue);
  const formValues = useSelector(form.store, (state) => state.values);

  const handleNext = async () => {
    await handleNextStepOrSubmit(form);
  };

  const totalSteps = 3;

  const progress = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep],
  );

  return (
    <section className="mx-auto h-full max-w-[1440px] px-6 py-8 lg:px-20">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Business <span className="px-1">/</span> Create
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create a new business
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up a new business and start managing it with your team.
          </p>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">
          Step {currentStep} of {steps.length}
        </span>
      </div>
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium">
          {steps.map((label, index) => (
            <span
              key={label}
              className={
                index + 1 <= currentStep
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            >
              {index + 1 <= currentStep ? "● " : `${index + 1} `}
              {label}
            </span>
          ))}
        </div>
        <Progress value={progress} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleNext();
          }}
          noValidate
          className="mx-auto flex w-full flex-col gap-2 bg-card px-6 pt-3 pb-6 rounded-lg"
        >
          <div className="flex flex-col gap-2 pt-3">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex flex-col gap-2"
              >
                {currentStep === 1 && (
                  <FieldGroup className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Info</h3>
                    <FieldDescription>
                      Enter the business name, email, phone, website, and
                      address.
                    </FieldDescription>

                    <form.AppField
                      name="name"
                      children={(field) => (
                        <field.TextField
                          label="Business Name"
                          required
                          placeholder="Enter business name"
                        />
                      )}
                    />
                    <form.AppField
                      name="email"
                      children={(field) => (
                        <field.TextField
                          label="Email"
                          type="email"
                          placeholder="Enter email"
                        />
                      )}
                    />

                    <form.AppField
                      name="phone"
                      children={(field) => (
                        <field.TextField
                          label="Phone"
                          type="tel"
                          placeholder="Enter phone number"
                        />
                      )}
                    />
                  </FieldGroup>
                )}

                {currentStep === 2 && (
                  <FieldGroup className="space-y-4">
                    <h3 className="text-lg font-semibold">Details</h3>
                    <FieldDescription>
                      Add a detailed product description.
                    </FieldDescription>

                    <form.AppField
                      name="website"
                      children={(field) => (
                        <field.TextField
                          label="Website"
                          type="url"
                          placeholder="Enter website URL"
                        />
                      )}
                    />

                    <form.AppField
                      name="address"
                      children={(field) => (
                        <field.TextField
                          label="Address"
                          placeholder="Enter address"
                        />
                      )}
                    />

                    <form.AppField
                      name="description"
                      children={(field) => (
                        <field.TextareaField
                          label="Description"
                          placeholder="Enter product description"
                          maxLength={500}
                          rows={5}
                        />
                      )}
                    />
                  </FieldGroup>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Review & Submit</h3>
                    <FieldDescription>
                      Review the details below before submitting.
                    </FieldDescription>
                    <ReviewSummary values={formValues} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex w-full items-center justify-between gap-3 pt-3">
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={isFirstStep}
                onClick={() => handleCancelOrBack({ onBack: () => {} })}
              >
                <Icons.chevronLeft /> Previous
              </Button>
              <div className="flex w-full items-center justify-end gap-3 pt-3">
                {!isDefault && (
                  <Button
                    type="button"
                    onClick={() => form.reset()}
                    className="rounded-lg"
                    variant="outline"
                    size="sm"
                  >
                    Reset
                  </Button>
                )}
                {step.isCompleted ? (
                  <Button type="submit">Submit</Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => void handleNext()}
                  >
                    Next <Icons.chevronRight />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Business Details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness />
              </div>
              <div>
                <p className="font-semibold">
                  {formValues.name || "Business Name"}
                </p>
              </div>
            </div>
            <Separator />
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" />
              {formValues.email || "nil"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" />
              {formValues.phone || "nil"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Globe2 className="size-4" />
              {formValues.website || "nil"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {formValues.address || "nil"}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
