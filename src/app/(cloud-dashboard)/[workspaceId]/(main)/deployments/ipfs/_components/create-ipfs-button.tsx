import { ButtonGroup } from "@/components/ui/button-group";
import { Roles } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";

interface CreateIPFSButtonProps {
  workspaceId: string;
}

export const CreateIPFSButton = async ({
  workspaceId,
}: CreateIPFSButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  const menu = [
    {
      title: "Peers",
      href: `/${workspaceId}/deployments/ipfs/peers/new`,
    },
    {
      title: "Cluster Peers",
      href: `/${workspaceId}/deployments/ipfs/cluster-peers/new`,
    },
  ];

  return <ButtonGroup title="Create New" menu={menu} />;
};
