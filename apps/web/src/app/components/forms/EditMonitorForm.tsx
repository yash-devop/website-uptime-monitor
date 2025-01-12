"use client";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editMonitorSchema } from "@repo/common";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type EditMonitorFormFields = z.infer<typeof editMonitorSchema>;
export default function EditMonitorForm() {
  const { teamId, monitorId } = useParams();
  const router = useRouter();
  const regions = [
    { id: "ap-south-1", label: "India" },
    { id: "ap-usa-1", label: "USA" },
  ] as const;
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors, defaultValues, touchedFields, isDirty },
  } = useForm<EditMonitorFormFields>({
    resolver: zodResolver(editMonitorSchema),
    defaultValues: async (): Promise<EditMonitorFormFields> => {
      try {
        const response = await fetch(
          `/api/team/${teamId}/monitors/${monitorId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }
        const result: { data: EditMonitorFormFields } = await response.json();

        return {
          ...result.data,
          httpRequestBody: result.data.httpRequestBody ?? "", // Default to an empty string
          headerName: result.data.headerName ?? undefined,
          headerValue: result.data.headerValue ?? undefined,
          regions: result.data.regions,
        };
      } catch (err) {
        const error = err as Error;
        toast.error(error.message, {
          className: "p-4 text-red-400",
        });
        return {
          url: "",
          urlAlias: "",
          alertWhen: "URL_BECOMES_UNAVAILABLE",
          alertUsing: undefined,
          recoveryPeriod: 300000,
          confirmationPeriod: 30000,
          checkFrequency: "10000",
          httpMethods: "get",
          httpRequestTimeout: 30000,
          headerName: undefined,
          headerValue: undefined,
          httpRequestBody: "",
          regions: undefined,
        };
      }
    },
  });

  useEffect(() => {
    console.log("defaultValues", defaultValues);
    console.log("Validation errors:", errors);
  }, [errors]);

  const onSubmit: SubmitHandler<EditMonitorFormFields> = async (data) => {
    if (!defaultValues) {
      return;
    }

    // Define the type for editedData to allow any value that could be in the form (string, number, string[], or undefined)
    const editedData: Partial<
      Record<
        keyof EditMonitorFormFields,
        string | number | string[] | undefined
      >
    > = {};
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof EditMonitorFormFields;
      if (
        typedKey === "regions"
          ? data[typedKey] &&
            defaultValues[typedKey] &&
            !areArraysEqual(data[typedKey], defaultValues[typedKey])
          : data[typedKey] !== defaultValues[typedKey]
      ) {
        editedData[typedKey] = data[typedKey];
      }
    });
    try {
        const response = await fetch(`/api/team/${teamId}/monitors/${monitorId}/edit`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          // other than 2xx and 3xx
          const { error } = await response.json();
          throw new Error(error).message;
        }
  
        const result = await response.json();
  
        toast.success(result?.message);
  
        router.push(`/dashboard/team/${teamId}/monitors`);
      } catch (error) {
        const err = (error as Error).message;
        console.log("error", err);
        toast.error(err);
      }
  };

  // Utility function to compare two arrays for equality
  function areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EditMonitorSection className="pt-8">
          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>What to Monitor</OptionHeading>
              <OptionDescription>
                Configure the target website you want to monitor. You'll find
                the advanced configuration below, in the advanced settings
                section.
              </OptionDescription>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col gap-2">
                <Label htmlFor="alertWhen" className="text-xs tracking-wide">
                  Alert us when
                </Label>
                <Controller
                  name="alertWhen"
                  control={control}
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="max-w-xs w-full" id="alertWhen">
                        <SelectValue placeholder="URL becomes unavailable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="URL_BECOMES_UNAVAILABLE">
                          URL becomes unavailable
                        </SelectItem>
                        <SelectItem value="URL_DOESNT_HAVE_KEYWORD">
                          URL doesn't have keyword
                        </SelectItem>
                        <SelectItem value="URL_HAVE_KEYWORD">
                          URL have keyword
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="url" className="text-xs tracking-wide">
                  URL to monitor
                </Label>
                <Input
                  {...register("url")}
                  id="url"
                  placeholder="https: // http://"
                />
                {errors.url && (
                  <div className="text-destructive">{errors.url.message}</div>
                )}
              </div>
            </OptionRightSection>
          </OptionRow>

          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>On-call escalation</OptionHeading>
              <OptionDescription>
                Set up rules for who's going to be notified and how when an
                incident occurs.
              </OptionDescription>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col gap-2">
                <Label htmlFor="oncall" className="text-xs tracking-wide">
                  When there's a new incident
                </Label>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Checkbox className="border-neutral-5" checked />
                    <Label className="text-sm">Send e-mail</Label>
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="v1 stage supports email mode only."
                  >
                    <Checkbox className="border-neutral-5" disabled />
                    <Label
                      className="text-sm"
                      title="v1 stage supports email mode only."
                    >
                      Call
                    </Label>
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="v1 stage supports email mode only."
                  >
                    <Checkbox className="border-neutral-5" disabled />
                    <Label className="text-sm">Push Notifications</Label>
                  </div>
                </div>
              </div>
            </OptionRightSection>
          </OptionRow>

          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>Advanced Settings</OptionHeading>
              <OptionDescription>
                These are the extra advanced settings that you might need in
                order to create a monitor.
                <br />
                <span className="leading-10">
                  Note: If you dont want , just leave as defaults.
                </span>
              </OptionDescription>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col gap-2">
                <Label htmlFor="urlAlias" className="text-xs tracking-wide">
                  Friendly monitor name
                </Label>
                <Input
                  {...register("urlAlias")}
                  id="urlAlias"
                  type="text"
                  placeholder="abc-example"
                />
                {errors.urlAlias && (
                  <div className="text-destructive">
                    {errors.urlAlias.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-start w-full gap-8">
                <div className="flex flex-col gap-2 w-full">
                  <Label
                    htmlFor="recoveryPeriod"
                    className="text-xs tracking-wide"
                  >
                    Recovery Period
                  </Label>
                  <Controller
                    name="recoveryPeriod"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="w-full" id="recoveryPeriod">
                            <SelectValue placeholder="5 minutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300000">5 minutes</SelectItem>
                            <SelectItem value="480000">8 minutes</SelectItem>
                            <SelectItem value="600000">10 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <Label className="text-neutral-4 text-xs">
                    How long the monitor must be up to automatically mark an
                    incident as resolved.
                  </Label>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="select" className="text-xs tracking-wide">
                    Confirmation Period
                  </Label>
                  <Controller
                    name="confirmationPeriod"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger
                            className="w-full"
                            id="confirmationPeriod"
                          >
                            <SelectValue placeholder="30 seconds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30000">30 Seconds</SelectItem>
                            <SelectItem value="45000">45 seconds</SelectItem>
                            <SelectItem value="60000">60 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  <Label className="text-neutral-4 text-xs">
                    How long to wait after observing a failure before we start a
                    new incident.
                  </Label>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs pr-7">
                <Label
                  htmlFor="recoveryPeriod"
                  className="text-xs tracking-wide"
                >
                  Check Frequency
                </Label>
                <Controller
                  name="checkFrequency"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full" id="checkFrequency">
                          <SelectValue placeholder="10 seconds" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10000">10 seconds</SelectItem>{" "}
                          {/* for testing , i have given in seconds.... in prod i'll change it to minutes */}
                          <SelectItem value="300000">30 seconds</SelectItem>
                          <SelectItem value="60000">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                <Label className="text-neutral-4 text-xs">
                  How long the monitor must be up to automatically mark an
                  incident as resolved.
                </Label>
              </div>
            </OptionRightSection>
          </OptionRow>

          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>Request Parameters</OptionHeading>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col md:flex-row items-start w-full gap-8">
                <div className="flex flex-col gap-2 w-full">
                  <Label
                    htmlFor="httpMethods"
                    className="text-xs tracking-wide"
                  >
                    HTTP method used to make the request
                  </Label>
                  <Controller
                    name="httpMethods"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full" id="httpMethods">
                            <SelectValue placeholder="GET" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="get">GET</SelectItem>
                            <SelectItem value="post">POST</SelectItem>
                            <SelectItem value="put">PUT</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  <Label className="text-neutral-4 text-xs">
                    How long the monitor must be up to automatically mark an
                    incident as resolved.
                  </Label>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="select" className="text-xs tracking-wide">
                    Request Timeout
                  </Label>
                  <Controller
                    name="httpRequestTimeout"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger
                            className="w-full"
                            id="httpRequestTimeout"
                          >
                            <SelectValue placeholder="30 seconds" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30000">30 Seconds</SelectItem>
                            <SelectItem value="45000">45 seconds</SelectItem>
                            <SelectItem value="60000">60 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors.httpRequestTimeout && (
                    <div className="text-destructive">
                      {errors.httpRequestTimeout.message}
                    </div>
                  )}
                  <Label className="text-neutral-4 text-xs">
                    How long to wait after observing a failure before we start a
                    new incident.
                  </Label>
                </div>
              </div>
            </OptionRightSection>
          </OptionRow>

          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>Request Headers</OptionHeading>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col md:flex-row items-start w-full gap-8">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="headerName" className="text-xs tracking-wide">
                    Header name
                  </Label>
                  <Input
                    {...register("headerName")}
                    id="headerName"
                    placeholder="Authorization"
                  />
                  {errors.headerName && (
                    <div className="text-destructive">
                      {errors.headerName.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label
                    htmlFor="headerValue"
                    className="text-xs tracking-wide"
                  >
                    Header value
                  </Label>
                  <Input
                    {...register("headerValue")}
                    id="headerValue"
                    placeholder="Bearer <token>"
                  />
                  {errors.headerValue && (
                    <div className="text-destructive">
                      {errors.headerValue.message}
                    </div>
                  )}
                </div>
              </div>
            </OptionRightSection>
          </OptionRow>

          <OptionRow>
            <OptionLeftSection>
              <OptionHeading>Regions</OptionHeading>
              <OptionDescription>
                What locations should we check your website from?
              </OptionDescription>
            </OptionLeftSection>
            <OptionRightSection>
              <div className="flex flex-col md:flex-row items-start gap-6">
                {regions.map((region) => (
                  <Controller
                    key={region.id} // Ensure key is unique for each region
                    name="regions"
                    control={control}
                    render={({ field }) => {
                      const selectedRegions = field.value || []; // Ensure field.value is always an array
                      console.log("field", selectedRegions);

                      return (
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            {...register("regions")}
                            id={region.id}
                            className="border-neutral-5"
                            value={region.id}
                            checked={
                              region.id === "ap-south-1" ||
                              selectedRegions.includes(region.id) // Ensure "India" is always checked
                            }
                            onCheckedChange={(checked) => {
                              // Allow toggling for other regions
                              if (region.id !== "ap-south-1") {
                                const updatedRegions = checked
                                  ? [...selectedRegions, region.id]
                                  : selectedRegions.filter(
                                      (val) => val !== region.id
                                    );
                                field.onChange(updatedRegions);
                              }
                            }}
                          />
                          <Label htmlFor={region.id} className="text-sm">
                            {region.label}
                          </Label>
                        </div>
                      );
                    }}
                  />
                ))}
                {/* Validation Error */}
                {errors.regions && (
                  <div className="text-destructive">
                    {errors.regions.message}
                  </div>
                )}
              </div>
            </OptionRightSection>
          </OptionRow>
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="w-fit"
            >
              Edit monitor
            </Button>
          </div>
        </EditMonitorSection>
      </form>
    </>
  );
}
const EditMonitorSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={cn(`flex flex-col gap-8`, className)}>{children}</div>
    </>
  );
};

const OptionRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <section
        className={cn(
          `flex flex-col lg:grid lg:grid-cols-[430px_1fr] gap-y-4 lg:gap-y-0 gap-x-10 py-10`,
          className
        )}
      >
        {children}
      </section>
    </>
  );
};

const OptionLeftSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={cn(`space-y-3`, className)}>{children}</div>
    </>
  );
};
const OptionRightSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={cn(`flex flex-col gap-8 pt-2`, className)}>
        {children}
      </div>
    </>
  );
};

const OptionHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <h1 className={cn(`text-lg tracking-tight`, className)}>{children}</h1>
    </>
  );
};
const OptionDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <p
        className={cn(
          `text-sm tracking-tight max-w-sm text-neutral-4`,
          className
        )}
      >
        {children}
      </p>
    </>
  );
};
