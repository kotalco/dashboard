"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Roles } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  role: z.nativeEnum(Roles, {
    required_error: "Please select a your team member role",
  }),
});

type SchemaType = z.infer<typeof schema>;

interface AddMemberFormProps {
  workspaceId: string;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
  workspaceId,
}) => {
  const router = useRouter();
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  const {
    formState: {
      isSubmitted,
      isSubmitting,
      isValid,
      isDirty,
      errors,
      isSubmitSuccessful,
    },
    setError,
    reset,
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  async function onSubmit(values: SchemaType) {
    try {
      await client.post(`/workspaces/${workspaceId}/members`, values);
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        response?.status === 404 &&
          setError("root", {
            type: response?.status.toString(),
            message: `Cann't find user with email ${values.email}. Please make sure that the user is already registered.`,
          });

        response?.status !== 404 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Something went wrong.",
          });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="add-member-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <div className="grid items-start grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-6 xl:col-span-4">
                <FormControl>
                  <Input
                    data-testid="email"
                    disabled={isSubmitting}
                    placeholder="Email Address"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="role" className="bg-white">
                      <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getSelectItems(Roles).map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage className="shrink-0" />
              </FormItem>
            )}
          />

          <Button
            data-testid="submit"
            disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
            className="col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-2"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-6 h-6 mr-2" />
            )}{" "}
            Add Member
          </Button>
        </div>

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              New team memeber has been added to this workspace.
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
