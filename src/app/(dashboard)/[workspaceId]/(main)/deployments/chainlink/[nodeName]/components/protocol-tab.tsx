import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { BitcoinNetworks, ChainlinkNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { ChainlinkNode, Version } from "@/types";

interface ProtocolTabProps {
  node: ChainlinkNode;
  role: Roles;
  versions: Version[];
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({
  node,
  role,
  versions,
}) => {
  const { ethereumChainId, linkContractAddress, image, name } = node;
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <span className="text-sm text-foreground/50">Chainlink</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">EVM Chain</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(
              ChainlinkNetworks,
              `${ethereumChainId}:${linkContractAddress}`
            )}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Chain ID</span>
          <span className="text-sm text-foreground/50">{ethereumChainId}</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Link Contract Address
          </span>
          <span className="text-sm text-foreground/50">
            {linkContractAddress}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/smartcontractkit/chainlink"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Chainlink
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        updateUrl={`/chainlink/nodes/${name}`}
      />
    </>
  );
};
