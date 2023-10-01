"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, IPFSPeer, Secret } from "@/types";
import {
  ExecutionClientSyncMode,
  IPFSConfigProfile,
  Roles,
  SecretType,
} from "@/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ConfigrationProfilesTabProps {
  node: IPFSPeer;
  role: Roles;
}

const schema = z.object({
  profiles: z.nativeEnum(IPFSConfigProfile).array(),
});

type Schema = z.input<typeof schema>;

export const ConfigrationProfilesTab: React.FC<
  ConfigrationProfilesTabProps
> = ({ node, role }) => {
  const params = useParams();
  const { initProfiles, profiles } = node;
  const remainingProfilesOptions = getSelectItems(IPFSConfigProfile).filter(
    ({ value }) => !initProfiles.includes(value)
  );

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { profiles },
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
    reset,
    setError,
  } = form;

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<IPFSPeer>(
        `/ipfs/peers/${node.name}`,
        values
      );
      const { profiles } = data;
      reset({ profiles });
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  };

  return (
    <>
      <Label>Initial Configration Profiles</Label>
      <ul className="mb-5 ml-5 text-sm">
        {initProfiles.map((profile) => (
          <li key={profile} className="text-gray-500 list-disc">
            {profile}
          </li>
        ))}
      </ul>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-4"
        >
          <FormField
            control={form.control}
            name="profiles"
            render={() => (
              <FormItem>
                <div className="mt-4">
                  <FormLabel>Configuration Profiles</FormLabel>
                </div>
                <div className="grid grid-cols-2 ml-5 gap-3 max-w-sm">
                  {remainingProfilesOptions.map(({ value, label }) => (
                    <FormField
                      key={value}
                      control={form.control}
                      name="profiles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={value}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                disabled={isSubmitting || role === Roles.Reader}
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
                            <FormLabel className="font-normal">
                              {label}
                            </FormLabel>
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

          {isSubmitSuccessful && (
            <Alert variant="success" className="text-center">
              <AlertDescription>
                Configration profiles have been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {errors.root && (
            <Alert variant="destructive" className="text-center">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          {role !== Roles.Reader && (
            <TabsFooter>
              <Button
                disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
                data-testid="submit"
                type="submit"
              >
                Save
              </Button>
            </TabsFooter>
          )}
        </form>
      </Form>
    </>
  );
};
