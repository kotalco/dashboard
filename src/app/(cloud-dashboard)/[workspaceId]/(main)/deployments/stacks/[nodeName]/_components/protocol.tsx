import { StacksNetworks } from "@/enums";
import { StacksNode } from "@/types";
import { getEnumKey } from "@/lib/utils";

import { ExternalLink } from "@/components/ui/external-link";

interface ProtocolProps {
  node: StacksNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network } = node;

  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm">Protocol</span>
          <span className="text-foreground/50">Stacks</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Chain</span>
          <span className="text-foreground/50">
            {getEnumKey(StacksNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Client</span>
          <ExternalLink href="https://github.com/stacks-network/stacks-blockchain">
            Stacks
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
