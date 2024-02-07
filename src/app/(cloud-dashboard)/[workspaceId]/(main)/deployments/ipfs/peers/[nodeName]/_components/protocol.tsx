import { IPFSPeer } from "@/types";

import { Heading } from "@/components/ui/heading";
import { ExternalLink } from "@/components/ui/external-link";

interface ProtocolProps {
  node: IPFSPeer;
}

export const Protocol = ({ node }: ProtocolProps) => {
  return (
    <>
      <Heading title="Protocol" id="protocol" variant="h2" />
      <ul className="space-y-3">
        <li>
          <span className="text-sm">Protocol</span>
          <br />
          <span className="text-foreground/50">IPFS</span>
        </li>

        <li>
          <span className="text-sm">Chain</span>
          <br />
          <span className="text-foreground/50">Public Swarm</span>
        </li>

        <li>
          <span className="text-sm">Client</span>
          <br />
          <ExternalLink href="https://github.com/ipfs/kubo">Kubo</ExternalLink>
        </li>
      </ul>
    </>
  );
};
