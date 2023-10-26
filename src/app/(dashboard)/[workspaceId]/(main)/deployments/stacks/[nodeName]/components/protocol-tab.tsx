import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { Roles, StacksNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { StacksNode, Version } from "@/types";

interface ProtocolTabProps {
  node: StacksNode;
  role: Roles;
  versions: Version[];
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({
  node,
  role,
  versions,
}) => {
  const { network, image, name } = node;
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <span className="text-sm text-foreground/50">Stacks</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Chain</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(StacksNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/stacks-network/stacks-blockchain"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Stacks
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        updateUrl={`/stacks/nodes/${name}`}
      />
    </>
  );
};
