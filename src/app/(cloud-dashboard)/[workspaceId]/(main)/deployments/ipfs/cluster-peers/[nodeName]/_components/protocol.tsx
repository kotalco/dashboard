import { ConsensusAlgorithm } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { IPFSClusterPeer } from "@/types";

import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface ProtocolProps {
  node: IPFSClusterPeer;
}

export const Protocol = ({ node }: ProtocolProps) => {
  const { consensus, id, privatekeySecretName } = node;

  return (
    <>
      <Heading variant="h2" title="Protocol" id="protocol" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm">Protocol</span>
          <span className="text-foreground/50">IPFS</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Chain</span>
          <span className="text-foreground/50">public-swarm</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Client</span>
          <ExternalLink href="https://github.com/ipfs/ipfs-cluster">
            ipfs-cluster-service
          </ExternalLink>
        </li>

        <li className="flex flex-col">
          <span className="text-sm">Consensus</span>
          <span className="text-foreground/50">
            {getEnumKey(ConsensusAlgorithm, consensus)}
          </span>
        </li>

        {id && (
          <li className="flex flex-col">
            <span className="text-sm">ID</span>
            <span className="text-foreground/50">{id}</span>
          </li>
        )}

        {privatekeySecretName && (
          <li className="flex flex-col">
            <span className="text-sm">From</span>
            <span className="text-foreground/50">{privatekeySecretName}</span>
          </li>
        )}
      </ul>
    </>
  );
};
