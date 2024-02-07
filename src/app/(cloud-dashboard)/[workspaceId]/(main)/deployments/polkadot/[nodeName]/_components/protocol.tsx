import { PolkadotNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { PolkadotNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: PolkadotNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network, image, name } = node;
  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm">Protocol</span>
          <span className="text-foreground/50">Polkadot</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(PolkadotNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Client</span>
          <ExternalLink href="https://github.com/paritytech/polkadot">
            Parity Polkadot
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
