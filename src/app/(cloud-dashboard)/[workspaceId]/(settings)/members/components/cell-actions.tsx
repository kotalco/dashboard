import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Roles } from "@/enums";
import { client } from "@/lib/client-instance";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TeamMemberColumn } from "./columns";

interface CellRoleProps {
  data: TeamMemberColumn;
}

export const CellActions: React.FC<CellRoleProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { workspace, isLoading: isInitialLoading } = useWorkspace(
    params.workspaceId as string
  );
  const { isCurrentUser, id, email } = data;

  if (isInitialLoading) return <Skeleton className="w-4 h-4 " />;

  if (isCurrentUser || workspace?.role !== Roles.Admin) return null;

  async function onDeleteMember() {
    try {
      setLoading(true);
      await client.delete(`/workspaces/${params.workspaceId}/members/${id}`);
      router.refresh();
    } catch (error) {
      setError("Something went wrong.");
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
      <AlertModal
        isOpen={open}
        onClose={onClose}
        onConfirm={onDeleteMember}
        title="Remove Team Member"
        description={`Are you sure you want to delete member (${email})? This user will not be able to access any deployment untill invited again`}
        loading={loading}
      >
        {error && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AlertModal>
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          disabled={loading}
          variant="destructive"
          size="icon"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
