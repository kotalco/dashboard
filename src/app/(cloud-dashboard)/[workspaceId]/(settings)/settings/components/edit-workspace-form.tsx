"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { client } from "@/lib/client-instance";
import { User, Workspace } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAction } from "@/hooks/use-action";
import { editWorkspace } from "@/actions/edit-workspace";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

const schema = z.object({
  name: z.string().min(3, "Workspace name must be 3 characters at least"),
});

type SchemaType = z.infer<typeof schema>;

interface EditWorkspaceFormProps {
  workspace: Workspace;
}

export const EditWorkspaceForm: React.FC<EditWorkspaceFormProps> = ({
  workspace,
}) => {
  const { name, id } = workspace;
  const { execute, error, success, fieldErrors } = useAction(editWorkspace);
  const router = useRouter();
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { name },
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

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;

    execute({ name }, { workspaceId: id });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input
        id="name"
        errors={fieldErrors}
        label="Workspace Name"
        defaultValue={name}
      />

      <SubmitSuccess success={success}>
        Your workspace name has been has been changed.
      </SubmitSuccess>
      <SubmitError error={error} />

      <SubmitButton>Save</SubmitButton>
    </form>
  );
};
