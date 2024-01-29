import { NEARNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NEARNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: NEARNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network } = node;
  return (
    <>
      <Heading variant="h2" title="Protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm leading-none">Protocol</span>
          <span className="text-foreground/50">NEAR</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(NEARNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="font-medium text-foreground">Client</span>
          <ExternalLink href="https://github.com/near/nearcore">
            NEAR Core
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
