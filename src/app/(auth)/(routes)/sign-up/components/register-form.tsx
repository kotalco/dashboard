"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";
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
import { StorageItems } from "@/enums";

const schema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email")
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be not less than 6 characters"),
    password_confirmation: z.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    { message: "Passwords didn't match", path: ["password_confirmation"] }
  );

type SchemaType = z.infer<typeof schema>;

const defaultValues = { email: "", password: "", password_confirmation: "" };

export const RegisterForm = () => {
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
      const { data } = await api.post<User>(`/users`, values);
      !data.platform_admin &&
        localStorage.setItem(StorageItems.NEW_ACCOUNT, data.email);
      router.push("/sign-in");
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;
        response?.status === 409 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Email already exists.",
          });
        response?.status !== 409 &&
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
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          className="w-full"
          type="submit"
        >
          Sign Up
        </Button>

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
