import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { Roles } from "@/enums";

import { SelectWithInput } from "@/components/form/select-with-input";
import { MultiSelect } from "@/components/form/multi-select";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";

interface PeersProps {
  node: IPFSClusterPeer;
  role: Roles;
  peers: IPFSPeer[];
  clusterPeers: IPFSClusterPeer[];
  errors?: Record<string, string[] | undefined>;
}

export const Peers = ({
  node,
  role,
  peers,
  clusterPeers,
  errors,
}: PeersProps) => {
  const { peerEndpoint, bootstrapPeers, trustedPeers, name } = node;

  const peerEndpoints = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const ipfsClusterPeers = clusterPeers.map(({ name, id }) => ({
    label: name,
    value: `/dns4/${name}/tcp/9096/p2p/${id}`,
  }));

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Peers" id="peers" />
      <SelectWithInput
        id="peerEndpoint"
        label="IPFS Peer"
        placeholder="Select a Peer"
        options={peerEndpoints}
        otherLabel="Use External Peer"
        className="max-w-xs"
        errors={errors}
        disabled={role === Roles.Reader}
        defaultValue={peerEndpoint}
      />

      <MultiSelect
        id="bootstrapPeers"
        label="Bootstrap Cluster Peers"
        placeholder="Select bootstrap peers"
        options={ipfsClusterPeers}
        allowCustomValues
        className="max-w-xs"
        errors={errors}
        disabled={role === Roles.Reader}
        defaultValue={bootstrapPeers}
      />

      {!!trustedPeers && (
        <div className="max-w-xs mt-4">
          <Label>Trusted Cluster Peers</Label>
          <ul className="ml-5 text-sm">
            {trustedPeers.map((peer) => (
              <li key={peer} className="text-foreground/50 list-disc">
                {peer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
