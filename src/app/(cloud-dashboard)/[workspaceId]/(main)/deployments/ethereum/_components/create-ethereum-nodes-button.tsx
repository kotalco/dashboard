import { ButtonGroup } from "@/components/ui/button-group";
import { Roles } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";

interface CreateEthereumNodesButtonProps {
  workspaceId: string;
}

export const CreateEthereumNodesButton = async ({
  workspaceId,
}: CreateEthereumNodesButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  const menu = [
    {
      title: "Execution Client",
      href: `/${workspaceId}/deployments/ethereum/execution-clients/new`,
    },
    {
      title: "Beacon Node",
      href: `/${workspaceId}/deployments/ethereum/beacon-nodes/new`,
    },
    {
      title: "Validator",
      href: `/${workspaceId}/deployments/ethereum/validators/new`,
    },
  ];

  return <ButtonGroup title="Create New" menu={menu} />;
};
