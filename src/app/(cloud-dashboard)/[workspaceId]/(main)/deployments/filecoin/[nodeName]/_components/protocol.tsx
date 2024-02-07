import { FilecoinNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { FilecoinNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: FilecoinNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm leading-none">Protocol</span>
          <span className="text-foreground/50">Filecoin</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(FilecoinNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Client</span>
          <ExternalLink href="https://github.com/filecoin-project/lotus">
            Lotus
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
