"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { DeprecatedAlertModal } from "@/components/modals/deprecated-alert-modal";
import { client } from "@/lib/client-instance";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LeaveWorkspaceProps {
  workspaceId: string;
}

export const LeaveWorkspace: React.FC<LeaveWorkspaceProps> = ({
  workspaceId,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onLeaveWorkspace() {
    try {
      setLoading(true);
      setError("");
      await client.post(`/workspaces/${workspaceId}/leave`);
      router.push("/");
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        response?.status === 403 &&
          setError("You can't leave your own workspace.");
        response?.status !== 403 && setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  function onClose() {
    setError("");
    setOpen(false);
  }

  return (
    <>
      <DeprecatedAlertModal
        title="Leave Workspace"
        description="Are you sure you want to leave this workspace? You might not be able to join this workspace again if not invited"
        isOpen={open}
        onClose={onClose}
        loading={loading}
        onConfirm={onLeaveWorkspace}
      >
        {error && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DeprecatedAlertModal>

      <div className="flex justify-between gap-x-4">
        <p>
          Leave the current workspace, this action is critical and cann&apos;t
          be undone untill you have been invited again.
        </p>
        <Button
          data-testid="leave-button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          Leave Workspace
        </Button>
      </div>
    </>
  );
};
