import { AptosNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { AptosNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: AptosNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" />
      <ul className="space-y-4">
        <li className="flex flex-col">
          <span className="leading-none text-sm">Protocol</span>
          <span className="text-foreground/50">Aptos</span>
        </li>

        <li className="flex flex-col">
          <span className="leading-none text-sm">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(AptosNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="leading-none text-sm">Client</span>
          <ExternalLink href="https://github.com/aptos-labs/aptos-core">
            Aptos Core
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
