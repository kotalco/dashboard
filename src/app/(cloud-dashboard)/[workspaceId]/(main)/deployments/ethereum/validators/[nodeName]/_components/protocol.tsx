import { ValidatorClients, ValidatorNetworks } from "@/enums";
import { getClientUrl, getEnumKey } from "@/lib/utils";
import { ValidatorNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: ValidatorNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network, client } = node;
  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm">Protocol</span>
          <span className="text-foreground/50">Ethereum</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(ValidatorNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Client</span>
          <ExternalLink href={getClientUrl(client)}>
            {getEnumKey(ValidatorClients, client)}
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
