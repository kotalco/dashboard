"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SubmitError } from "@/components/form/submit-error";
import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";

import { useAction } from "@/hooks/use-action";
import { deleteNode } from "@/actions/delete-node";
import { CloseDialogButton } from "./ui/close-dialog-button";

interface DeleteFormWithInputProps {
  name: string;
  url: string;
  redirectUrl: string;
}

export const DeleteWithInputForm: React.FC<DeleteFormWithInputProps> = ({
  url,
  redirectUrl,
  name,
}) => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { execute, error } = useAction(deleteNode, {
    onSuccess: () => {
      toast(`${name} has been deleted successfully.`);
      router.push(redirectUrl);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    execute({ name }, { url, redirectUrl });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <p className="text-foreground/70 text-sm">
        This action cann&apos;t be undone. This will permnantly delete (
        <strong>{name}</strong>).
      </p>

      <p className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Please type ( <strong>{name}</strong> ) to confirm
      </p>
      <Input id="name" onChange={(e) => setValue(e.target.value)} />

      <SubmitError error={error} />

      <CloseDialogButton>
        <SubmitButton variant="destructive" disabled={name !== value}>
          Delete
        </SubmitButton>
      </CloseDialogButton>
    </form>
  );
};
