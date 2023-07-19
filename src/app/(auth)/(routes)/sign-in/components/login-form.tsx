"use client";

import * as z from "zod";
import Link from "next/link";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReverifyEmailALert } from "./reverify-email-alert";
import { useState } from "react";
import { StorageItems } from "@/enums";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be not less than 6 characters"),
  remember_me: z.boolean().default(false).optional(),
});

type SchemaType = z.infer<typeof schema>;
type APIResponse = { token: string; Authorized: boolean };

const defaultValues = { email: "", password: "", remember_me: false };

export const LoginForm = () => {
  const [email, setEmail] = useState<string>();
  const router = useRouter();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    setError,
  } = form;

  async function onSubmit(values: SchemaType) {
    try {
      const {
        data: { Authorized, token },
      } = await api.post<APIResponse>("/sessions", values);

      if (Authorized) {
        localStorage.setItem(StorageItems.AUTH_TOKEN, token);
        await axios.post("/set-cookie", {
          name: StorageItems.AUTH_TOKEN,
          value: token,
        });
        router.replace("/");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 401) {
          return setError("root", {
            type: response?.status.toString(),
            message: "Wrong Email or Password.",
          });
        }

        if (response?.status === 403) {
          setEmail(values.email);
          return setError("root", {
            type: response?.status.toString(),
          });
        }

        return setError("root", {
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember_me"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    disabled={isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
                <FormMessage />
              </FormItem>

              <div className="text-sm whitespace-nowrap">
                <Link
                  href="/forget-password"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}
        />

        <Button
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          className="w-full"
          type="submit"
        >
          Login
        </Button>

        {errors.root && errors.root.type !== "403" && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {errors.root?.type === "403" && (
          <ReverifyEmailALert email={email} setError={setError} />
        )}
      </form>
    </Form>
  );
};
