"use client";

import { useWorkspaceModal } from "@/hooks/useWorkspaceModal";
import { useAction } from "@/hooks/use-action";
import { createWorkspace } from "@/actions/create-workspace";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { useRouter } from "next/navigation";

export const WorksapceModal = () => {
  const { isOpen, onClose } = useWorkspaceModal();
  const router = useRouter();
  const { execute, error, fieldErrors } = useAction(createWorkspace, {
    onSuccess: (workspace) => {
      router.push(`/${workspace.id}`);
      onClose();
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    execute({ name });
  };

  return (
    <Modal
      title="Create New Workspace"
      description="Create a new workspace for your team and enjoy managing your nodes together."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="py-2 pb-4 space-y-4">
          <form action={onSubmit} className="space-y-2">
            <Input id="name" label="Name" errors={fieldErrors} />

            <SubmitError error={error} />

            <div className="flex items-center justify-end w-full pt-6 space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <SubmitButton>Create</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
