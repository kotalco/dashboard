import { useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getEnumKey, getSelectItems } from "@/lib/utils";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAPIMessage } from "@/hooks/useAPIMessage";
import { Roles, RolesWithCustomer } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { changeRole } from "@/actions/change-role";

import { Select } from "@/components/form/select";
import { Skeleton } from "@/components/ui/skeleton";

import { TeamMemberColumn } from "./columns";

interface CellRoleProps {
  data: TeamMemberColumn;
}

export const CellRole: React.FC<CellRoleProps> = ({ data }) => {
  const { workspaceId } = useParams();
  const [pending, startTransition] = useTransition();
  const { setMessage, clearMessage } = useAPIMessage();
  const { execute } = useAction(changeRole, {
    onSuccess: () => {
      setMessage({
        message: `Member (${data.email}) role has been changed for ${workspace?.name} workspace`,
        type: { variant: "success" },
      });
    },
    onError: () => {
      setMessage({
        message: "Something went wrong.",
        type: { variant: "destructive" },
      });
    },
  });
  const { workspace, isLoading: isInitialLoading } = useWorkspace(
    workspaceId as string
  );
  const { isCurrentUser, role, id, withCustomerRole } = data;

  useEffect(() => {
    return () => clearMessage();
  }, [clearMessage]);

  if (isInitialLoading) return <Skeleton className="w-[120px] h-10 " />;

  if (isCurrentUser || workspace?.role !== Roles.Admin)
    return <div className="pl-4">{getEnumKey(Roles, role)}</div>;

  const onChangeRole = (role: Roles) => {
    startTransition(() => {
      execute({ role }, { workspaceId: workspaceId as string, memberId: id });
    });
  };

  if (pending) {
    return (
      <div className="flex items-center justify-center max-w-[120px]">
        <Loader2 className="w-4 h-4 animate-spin text-foreground/50" />
      </div>
    );
  }

  return (
    <Select
      disabled={pending}
      id="role"
      value={role}
      defaultValue={role}
      onValueChange={onChangeRole}
      options={getSelectItems(withCustomerRole ? RolesWithCustomer : Roles)}
      className="max-w-[120px]"
    />
  );
};
