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
    params.workspaceId as string
  );
  const { isCurrentUser, role, id, email } = data;

  useEffect(() => {
    return () => clearMessage();
  }, [clearMessage]);

  if (isInitialLoading) return <Skeleton className="w-full h-4 " />;

  if (isCurrentUser || workspace?.role !== Roles.Admin)
    return <div className="pl-4">{getEnumKey(Roles, role)}</div>;

  async function onChangeRole(role: Roles) {
    try {
      setLoading(true);
      clearMessage();
      await client.patch(`/workspaces/${workspace?.id}/members/${id}`, {
        role,
      });
      setMessage({
        message: `Member (${email}) role has been changed for ${workspace?.name} workspace`,
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
      <SelectTrigger className="max-w-[100px]">
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
