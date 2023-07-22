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

const schema = z
  .object({
    old_password: z
      .string({ required_error: "Old password is required" })
      .min(6, "Your current password must be not less than 6 characters"),
    password: z
      .string({ required_error: "New password is required" })
      .min(6, "Your new password must be not less than 6 characters"),
    password_confirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine(
    ({ password, password_confirmation }) => password === password_confirmation,
    { message: "Passwords didn't match", path: ["password_confirmation"] }
  );

type SchemaType = z.infer<typeof schema>;

const defaultValues = {
  old_password: "",
  password: "",
  password_confirmation: "",
};

export const ChangePasswordForm = () => {
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
    setError,
  } = form;

  async function onSubmit(values: SchemaType) {
    try {
      await client.post<User>("/users/change_password", values);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        response?.status === 401 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Your current password isn't correct",
          });

        response?.status !== 401 &&
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
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" disabled={isSubmitting} {...field} />
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
              <FormLabel>New Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          type="submit"
        >
          Update Password
        </Button>

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Your password has been changed, you can now use your new password
              to login.
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
