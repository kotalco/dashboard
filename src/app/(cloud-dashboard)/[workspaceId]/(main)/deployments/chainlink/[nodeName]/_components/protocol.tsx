import { ChainlinkNode } from "@/types";
import { ChainlinkNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: ChainlinkNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { ethereumChainId, linkContractAddress } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" />
      <ul className="space-y-4">
        <li className="flex flex-col">
          <span className="text-sm leading-none">Protocol</span>
          <span className="text-sm text-foreground/50">Chainlink</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">EVM Chain</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(
              ChainlinkNetworks,
              `${ethereumChainId}:${linkContractAddress}`
            )}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Chain ID</span>
          <span className="text-foreground/50">{ethereumChainId}</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Link Contract Address</span>
          <span className="text-foreground/50">{linkContractAddress}</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Client</span>
          <ExternalLink href="https://github.com/smartcontractkit/chainlink">
            Chainlink
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
