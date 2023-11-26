import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { BitcoinNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { BitcoinNode, Version } from "@/types";

interface ProtocolTabProps {
  node: BitcoinNode;
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
          <span className="text-sm text-foreground/50">Bitcoin</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Network</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(BitcoinNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/bitcoin/bitcoin"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Bitcoin Core
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        updateUrl={`/bitcoin/nodes/${name}`}
      />
    </>
  );
};
