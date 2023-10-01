"use client";

import * as z from "zod";
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
import { IPFSConfigProfile } from "@/enums";
import { useToast } from "@/components/ui/use-toast";
import { getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Version } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z.object({
  name: z
    .string()
    .min(1, "Peer name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  initProfiles: z
    .nativeEnum(IPFSConfigProfile)
    .array()
    .nonempty("Initial configration profiles are required"),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const CreateIPFSPeerForm: React.FC<{ images: Version[] }> = ({
  images,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();

  const defaultValues = {
    name: "",
    initProfiles: [IPFSConfigProfile["default-datastore"]],
    image: images[0].image,
  };

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    setError,
  } = form;

  async function onSubmit(values: Schema) {
    try {
      await client.post("/ipfs/peers", values);
      router.push(`/${workspaceId}/deployments/ipfs?deployment=peers`);
      router.refresh();
      toast({
        title: "IPFS Peer has been created",
        description: `${values.name} peer has been created successfully, and will be up and running in few seconds.`,
      });
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

        if (response?.status === 403) {
          setError("root", {
            type: response?.status.toString(),
            message: "Reached Nodes Limit.",
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
        data-testid="create-peer"
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
              <FormLabel>Peer Name</FormLabel>
              <FormControl>
                <Input data-testid="name" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm">
          Client:{" "}
          <a
            href="https://github.com/ipfs/kubo"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            Kubo
          </a>
        </p>

        <FormField
          control={form.control}
          name="initProfiles"
          render={() => (
            <FormItem>
              <div className="mt-4">
                <FormLabel>Initial Configuration Profiles</FormLabel>
              </div>
              <div className="grid grid-cols-2 ml-5 gap-3">
                {getSelectItems(IPFSConfigProfile).map(({ value, label }) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="initProfiles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={value}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              disabled={isSubmitting}
                              checked={field.value?.includes(value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange(
                                      field.value
                                        ? [...field.value, value]
                                        : [value]
                                    )
                                  : field.onChange(
                                      field.value?.filter(
                                        (item) => item !== value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
