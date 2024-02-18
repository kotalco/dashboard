import { BitcoinNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { BitcoinNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: BitcoinNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-4">
        <li className="flex flex-col">
          <span className="leading-none text-sm">Protocol</span>
          <span className="text-foreground/50">Bitcoin</span>
        </li>

        <li className="flex flex-col">
          <span className="leading-none text-sm">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(BitcoinNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="leading-none text-sm">Client</span>
          <ExternalLink href="https://github.com/bitcoin/bitcoin">
            Bitcoin Core
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
