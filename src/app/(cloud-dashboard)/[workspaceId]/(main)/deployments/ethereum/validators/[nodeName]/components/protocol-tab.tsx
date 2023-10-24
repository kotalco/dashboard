import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { Roles, ValidatorClients, ValidatorNetworks } from "@/enums";
import { getClientUrl, getEnumKey } from "@/lib/utils";
import { ValidatorNode, Version } from "@/types";

interface ProtocolTabProps {
  node: ValidatorNode;
  role: Roles;
  versions: Version[];
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({
  node,
  role,
  versions,
}) => {
  const { network, image, name, client } = node;
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <span className="text-sm text-foreground/50">Ethereum</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Network</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(ValidatorNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href={getClientUrl(client)}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            {getEnumKey(ValidatorClients, client)}
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        updateUrl={`/ethereum2/validators/${name}`}
      />
    </>
  );
};
