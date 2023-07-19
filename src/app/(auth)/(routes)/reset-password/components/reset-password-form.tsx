"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";

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
import { client } from "@/lib/client-instance";

const schema = z
  .object({
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

const defaultValues = { password: "", password_confirmation: "" };

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: {
      isSubmitted,
      isSubmitting,
      isSubmitSuccessful,
      isValid,
      isDirty,
      errors,
    },
    setError,
  } = form;

  async function onSubmit(values: SchemaType) {
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    try {
      await client.post("/users/reset_password", { ...values, email, token });
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 404) {
          return setError("root", {
            type: response?.status.toString(),
            message: `Cann't find user with email ${email}`,
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
          Reset Password
        </Button>

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Congratulations, your email has been reset. You can now{" "}
              <Link
                href="/sign-ih"
                className="text-primary hover:underline underline-offset-4"
              >
                Login
              </Link>{" "}
              using your new password and enjoy our services.
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
