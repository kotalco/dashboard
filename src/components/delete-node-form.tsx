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

interface DeleteNodeFormProps {
  nodeName: string;
  url: string;
  redirectUrl: string;
}

export const DeleteNodeForm: React.FC<DeleteNodeFormProps> = ({
  url,
  redirectUrl,
  nodeName,
}) => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { execute, error } = useAction(deleteNode, {
    onSuccess: () => {
      toast(`${nodeName} node has been deleted successfully.`);
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
        <strong>{nodeName}</strong>) Aptos Node.
      </p>

      <Input
        id="name"
        label={`Please type node name (${nodeName}) to confirm`}
        onChange={(e) => setValue(e.target.value)}
      />

      <SubmitError error={error} />

      <CloseDialogButton>
        <SubmitButton variant="destructive" disabled={nodeName !== value}>
          Delete
        </SubmitButton>
      </CloseDialogButton>
    </form>
  );
};
