import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";

import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";

interface CreateAptosNodeButtonProps {
  workspaceId: string;
}

export const CreateAptosNodeButton = async ({
  workspaceId,
}: CreateAptosNodeButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  return (
    <Button asChild size="lg">
      <Link href={`/${workspaceId}/deployments/aptos/new`}>
        <Plus className="w-4 h-4 mr-2" />
        Create New Aptos Node
      </Link>
    </Button>
  );
};
