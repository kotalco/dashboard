"use client";

import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { Networks, ProtocolsWithoutEthereum2 } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/client-instance";
import { Switch } from "@/components/ui/switch";
import { getEnumKey } from "@/lib/utils";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  protocol: z.nativeEnum(ProtocolsWithoutEthereum2, {
    required_error: "Protocol name is required",
  }),
  network: z.string().optional(),
  use_basic_auth: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

export interface CreateEndpointFormProps {
  services: Record<ProtocolsWithoutEthereum2, string[]>;
}

export const CreateEndpointForm: React.FC<CreateEndpointFormProps> = ({
  services,
}) => {
  const router = useRouter();

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

  const [protocol] = watch(["protocol"]);

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/virtual-endpoints", values);
      router.push(`/virtual-endpoints`);
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
          name="protocol"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Protocol</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="protocols" className="bg-white">
                    <SelectValue placeholder="Choose a protocol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(services).map((protocol) => (
                    <SelectItem
                      key={protocol}
                      value={protocol}
                      className="items-center"
                    >
                      <Image
                        width={24}
                        height={24}
                        alt="decoration"
                        src={`/images/${protocol}.svg`}
                        className="w-6 h-6 inline-block mr-3"
                      />
                      <span>
                        {getEnumKey(ProtocolsWithoutEthereum2, protocol)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!!services[protocol]?.filter((el) => !!el).length && (
          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
                <FormLabel>Network</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="protocols" className="bg-white">
                      <SelectValue placeholder="Choose a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services[protocol]
                      .filter((el) => !!el)
                      .map((network) => (
                        <SelectItem
                          key={network}
                          value={network}
                          className="items-center"
                        >
                          {getEnumKey(Networks, network)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {protocol !== ProtocolsWithoutEthereum2.BITCOIN && (
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
