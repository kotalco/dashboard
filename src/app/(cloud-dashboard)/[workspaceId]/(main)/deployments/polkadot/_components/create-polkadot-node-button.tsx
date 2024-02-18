import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";

import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";

interface CreatePolkadotNodeButtonProps {
  workspaceId: string;
}

export const CreatePolkadotNodeButton = async ({
  workspaceId,
}: CreatePolkadotNodeButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  return (
    <Button asChild size="lg">
      <Link href={`/${workspaceId}/deployments/polkadot/new`}>
        <Plus className="w-4 h-4 mr-2" />
        New Polkadot Node
      </Link>
    </Button>
  );
};
