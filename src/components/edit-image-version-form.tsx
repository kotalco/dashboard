"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";
import { Version } from "@/types";
import { client } from "@/lib/client-instance";

interface EditImageVersionFormProps {
  role: Roles;
  versions: Version[];
  image: string;
  updateUrl: string;
}

const schema = z.object({
  image: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const EditImageVersionForm: React.FC<EditImageVersionFormProps> = ({
  role,
  versions,
  image,
  updateUrl,
}) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { image },
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
    watch,
  } = form;

  const watchedImage = watch("image");

  const onSubmit = async (values: Schema) => {
    try {
      await client.put(updateUrl, values);
      reset({ image: values.image });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Client Version</FormLabel>
              <Select
                disabled={isSubmitting || role === Roles.Reader}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    data-testid="client-version"
                    className="max-w-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {versions.map(({ name, image }) => (
                    <SelectItem key={image} value={image}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="flex flex-col">
                <span>Latest version is recommended</span>
                {watchedImage && (
                  <a
                    className="text-primary hover:underline underline-offset-4"
                    rel="noreferrer"
                    href={
                      versions?.find((version) => version.image === image)
                        ?.releaseNotes
                    }
                    target="_blank"
                  >
                    Release Notes
                  </a>
                )}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {versions?.find((version) => version.image === image)
          ?.canBeUpgraded && (
          <Alert variant="info">
            New image version is avaliable. It is recommended to update to
            latest version.
          </Alert>
        )}

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Client version has been updated successfully.
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
  );
};
