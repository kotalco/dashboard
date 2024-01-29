import { BeaconNodeClients, BeaconNodeNetworks } from "@/enums";
import { getClientUrl, getEnumKey } from "@/lib/utils";
import { BeaconNode } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";

interface ProtocolProps {
  node: BeaconNode;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { network, client } = node;
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm">Protocol</span>
          <span className="text-foreground/50">Ethereum</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Network</span>
          <span className="text-foreground/50">
            {getEnumKey(BeaconNodeNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Client</span>
          <ExternalLink href={getClientUrl(client)}>
            {getEnumKey(BeaconNodeClients, client)}
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};
