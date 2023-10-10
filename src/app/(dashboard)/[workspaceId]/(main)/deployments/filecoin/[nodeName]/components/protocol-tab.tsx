import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { FilecoinNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { FilecoinNode, Version } from "@/types";

interface ProtocolTabProps {
  node: FilecoinNode;
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
          <span className="text-sm text-foreground/50">Filecoin</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Network</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(FilecoinNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/filecoin-project/lotus"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Lotus
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        updateUrl={`/filecoin/nodes/${name}`}
      />
    </>
  );
};
