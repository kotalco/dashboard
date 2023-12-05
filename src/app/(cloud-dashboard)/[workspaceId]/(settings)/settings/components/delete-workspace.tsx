"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { DeprecatedAlertModal } from "@/components/modals/deprecated-alert-modal";
import { client } from "@/lib/client-instance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Workspace } from "@/types";
import { Roles } from "@/enums";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { SubmitError } from "@/components/form/submit-error";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";
import { useAction } from "@/hooks/use-action";
import { deleteWorkspace } from "@/actions/delete-workspace";

interface DeleteWorkspaceProps {
  workspace: Workspace;
}

export const DeleteWorkspace: React.FC<DeleteWorkspaceProps> = ({
  workspace,
}) => {
  const { id } = workspace;
  const { execute, error } = useAction(deleteWorkspace);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = () => {
    execute({ id });
  };

  // async function onDeleteWorkspace() {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     await client.delete(`/workspaces/${id}`);
  //     router.push("/");
  //   } catch (error) {
  //     if (isAxiosError(error)) {
  //       const { response } = error;

  //       response?.status === 403 &&
  //         setError("You can't delete your own workspace.");
  //       response?.status !== 403 && setError("Something went wrong.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // function onClose() {
  //   setError("");
  //   setOpen(false);
  // }

  return (
    <div className="flex justify-between gap-x-4">
      <p>
        Delete the current workspace. Please take care this is going to delete
        all deployments running in the current workspace
      </p>
      <AlertModal triggerText="Delete Workspace" title="Delete Workspace">
        <form action={onSubmit} className="space-y-4">
          <p className="text-foreground/70 text-sm">
            Are you sure you want to delete your workspace? all of your
            deployments will be permenantly removed from our servers forever.
            This action can't be undone
          </p>

          <SubmitError error={error} />

          <CloseDialogButton>
            <SubmitButton variant="destructive">Delete</SubmitButton>
          </CloseDialogButton>
        </form>
      </AlertModal>

      {/* <DeprecatedAlertModal
        title="Delete Workspace"
        description="Are you sure you want to delete your workspace? all of your deployments will be permenantly removed from our servers forever. This action can't be undone"
        isOpen={open}
        onClose={onClose}
        loading={loading}
        onConfirm={onDeleteWorkspace}
      >
        {error && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DeprecatedAlertModal>

      <div className="flex justify-between gap-x-4">
        <p>
          Delete the current workspace. Please take care this is going to delete
          all deployments running in the current workspace
        </p>
        <Button
          data-testid="delete-button"
          variant="destructive"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          Delete Workspace
        </Button>
      </div> */}
    </div>
  );
};
