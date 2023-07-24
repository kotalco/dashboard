import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getEnumKey, getSelectItems } from "@/lib/utils";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAPIMessage } from "@/hooks/useAPIMessage";
import { Roles } from "@/enums";
import { client } from "@/lib/client-instance";
import { TeamMemberColumn } from "./columns";

interface CellRoleProps {
  data: TeamMemberColumn;
}

export const CellRole: React.FC<CellRoleProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setMessage, clearMessage } = useAPIMessage();
  const { workspace, isLoading: isInitialLoading } = useWorkspace(
    params.workspaceId
  );
  const { isCurrentUser, role, id } = data;

  useEffect(() => {
    return () => clearMessage();
  }, [clearMessage]);

  if (isInitialLoading) return <Skeleton className="w-full h-4 " />;

  if (isCurrentUser || workspace?.role !== Roles.Admin)
    return <>{getEnumKey(Roles, role)}</>;

  async function onChangeRole(role: Roles) {
    try {
      setLoading(true);
      clearMessage();
      await client.patch(`/workspaces/${workspace?.id}/members/${id}`, {
        role,
      });
      setMessage({
        message: "Member role has been changed",
        type: { variant: "success" },
      });
      router.refresh();
    } catch (error) {
      setMessage({
        message: "Something went wrong.",
        type: { variant: "destructive" },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Select disabled={loading} defaultValue={role} onValueChange={onChangeRole}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {getSelectItems(Roles).map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
