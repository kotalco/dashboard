import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";

import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";

interface CreateStacksNodeButtonProps {
  workspaceId: string;
}

export const CreateStacksNodeButton = async ({
  workspaceId,
}: CreateStacksNodeButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  return (
    <Button asChild size="lg">
      <Link href={`/${workspaceId}/deployments/stacks/new`}>
        <Plus className="w-4 h-4 mr-2" />
        New Stacks Node
      </Link>
    </Button>
  );
};
