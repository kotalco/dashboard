import * as z from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "./ui/button";

interface DeleteNodeFormProps {
  onDelete: () => Promise<void>;
  nodeName: string;
}

const schema = z.object({
  name: z.string().min(1, "Please confirm node name"),
});

type Schema = z.infer<typeof schema>;

export const DeleteNodeForm: React.FC<DeleteNodeFormProps> = ({
  onDelete,
  nodeName,
}) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const {
    formState: {
      isSubmitting,

      errors,
    },
    watch,
    reset,
    setError,
  } = form;

  const name = watch("name");

  const onSubmit = async () => {
    try {
      await onDelete();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please type node name <strong>({nodeName})</strong> to confirm
              </FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Button
          disabled={isSubmitting || nodeName !== name}
          data-testid="submit"
          variant="destructive"
          type="submit"
          className="absolute bottom-0 left-24"
        >
          Delete
        </Button>
      </form>
    </Form>
  );
};
