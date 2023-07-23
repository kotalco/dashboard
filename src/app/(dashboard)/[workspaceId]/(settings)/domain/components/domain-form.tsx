"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { client } from "@/lib/client-instance";
import { User } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DomainFormProps {
  ip: string;
  domainName?: string;
}

const schema = z
  .object({
    domain: z.string().min(1, "Domain name is required"),
    isAware: z.literal<boolean>(true, {
      errorMap: () => ({
        message:
          "Please confirm that you are aware that will lead to old endpoints dysfunctional.",
      }),
    }),
    isUpdated: z.literal<boolean>(true, {
      errorMap: () => ({
        message:
          "Please confirm that you updated your domain DNS records according to out instructions.",
      }),
    }),
  })
  .transform(({ domain }) => {
    return { domain };
  });

type SchemaType = z.input<typeof schema>;

export const DomainForm: React.FC<DomainFormProps> = ({ ip, domainName }) => {
  const [count, setCount] = useState(10);
  const defaultValues = {
    domain: domainName || "",
    isAware: false,
    isUpdated: false,
  };

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: {
      isSubmitted,
      isSubmitting,
      isValid,
      isDirty,
      isSubmitSuccessful,
      errors,
    },
    watch,
    setError,
  } = form;

  const domain = watch("domain");

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/settings/domain", values);
      const interval = setInterval(() => setCount((c) => c - 1), 1000);
      setTimeout(() => {
        window.open(`https://${values.domain}`, "_self");
        clearInterval(interval);
      }, 10000);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain Name</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {domain && (
          <Alert>
            <AlertDescription>
              <p>
                Add DNS record of type A that maps <strong>{domain}</strong> to{" "}
                <strong>{ip}</strong>
              </p>
              <p>
                Add DNS record of type A that maps <strong>*.{domain}</strong>{" "}
                to <strong>{ip}</strong>
              </p>
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="isUpdated"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    disabled={isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I confirm that I have updated my domain DNS records
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAware"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    disabled={isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I am aware that updating domain will render old endpoints
                    dysfunctional
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            (isSubmitted && !isValid) ||
            isSubmitting ||
            !isDirty ||
            isSubmitSuccessful
          }
          type="submit"
        >
          {isSubmitSuccessful ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting in{" "}
              {count}s
            </span>
          ) : (
            "Save"
          )}
        </Button>

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              You domain settings has been changed. Please wait while we
              redirect you to your new domain.
            </AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
