"use client";

import * as z from "zod";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Protocol } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/client-instance";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  service_name: z.string({ required_error: "Service name is required" }),
  use_basic_auth: z.boolean().optional(),
  workspace_id: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export interface CreateEndpointFormProps {
  services: Service[];
}

export const CreateEndpointForm: React.FC<CreateEndpointFormProps> = ({
  services,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
    shouldUnregister: true,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    watch,
    setError,
  } = form;

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/endpoints", values);
      router.push(`/${workspaceId}/endpoints`);
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 400) {
          setError("root", {
            type: response?.status.toString(),
            message: "Name already exists.",
          });
          return;
        }

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
        data-testid="create-endpoint"
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="workspace_id"
          defaultValue={workspaceId as string}
          render={({ field }) => <Input className="sr-only" {...field} />}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint Name</FormLabel>
              <FormControl>
                <Input data-testid="name" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service_name"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Service Name</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="services" className="bg-white">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map(({ name, protocol }) => (
                    <SelectItem
                      key={name}
                      value={name}
                      className="items-center"
                    >
                      <Image
                        width={24}
                        height={24}
                        alt="decoration"
                        src={`/images/${protocol}.svg`}
                        className="w-6 h-6 inline-block mr-3"
                      />
                      <span>{name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {services?.find(({ name }) => name === watch("service_name"))
          ?.protocol !== Protocol.Bitcoin && (
          <FormField
            control={form.control}
            name="use_basic_auth"
            defaultValue={false}
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-3">
                  <FormLabel>Use Basic Authentication</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isSubmitting}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        )}

        <Button
          data-testid="submit"
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          type="submit"
        >
          Create
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
