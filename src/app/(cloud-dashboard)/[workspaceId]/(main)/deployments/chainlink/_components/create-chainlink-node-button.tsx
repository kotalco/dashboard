import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";

import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";

interface CreateChainlinkNodeButtonProps {
  workspaceId: string;
}

export const CreateChainlinkNodeButton = async ({
  workspaceId,
}: CreateChainlinkNodeButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  return (
    <Button asChild size="lg">
      <Link href={`/${workspaceId}/deployments/bitcoin/new`}>
        <Plus className="w-4 h-4 mr-2" />
        New Chainlink Node
      </Link>
    </Button>
  );
};
