import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import qs from "query-string";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Roles } from "@/enums";
import { client } from "@/lib/client-instance";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SecretColumn } from "./colums";

interface CellRoleProps {
  data: SecretColumn;
}

export const CellAction: React.FC<CellRoleProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { workspace, isLoading: isInitialLoading } = useWorkspace(
    params.workspaceId as string
  );
  const { name } = data;

  if (isInitialLoading) return <Skeleton className="w-4 h-4 " />;

  if (workspace?.role !== Roles.Admin) return null;

  async function onDeleteSecret() {
    try {
      const url = qs.stringifyUrl({
        url: `/core/secrets/${name}`,
        query: { workspace_id: params.workspaceId },
      });
      setLoading(true);
      await client.delete(url);
      router.refresh();
      setOpen(false);
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
        onConfirm={onDeleteSecret}
        title="Remove Secret"
        description={`Are you sure you want to remove secret (${name})?`}
        loading={loading}
      >
        {error && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AlertModal>
      <div className="flex justify-end transition opacity-0 group-hover:opacity-100">
        <Button
          onClick={() => setOpen(true)}
          disabled={loading}
          variant="outline"
          size="icon"
          className="border-destructive"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </>
  );
};
