import { ExecutionClientClients, ExecutionClientNetworks } from "@/enums";
import { getClientUrl, getEnumKey } from "@/lib/utils";
import { ExecutionClientNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: ExecutionClientNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network, client } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm leading-none">Protocol</span>
          <span className="text-foreground/50">Ethereum</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(ExecutionClientNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm leading-none">Client</span>
          <ExternalLink href={getClientUrl(client)}>
            {getEnumKey(ExecutionClientClients, client)}
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
