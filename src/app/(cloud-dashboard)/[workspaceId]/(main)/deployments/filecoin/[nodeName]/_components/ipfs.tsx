import { FilecoinNode, IPFSPeer } from "@/types";
import { Roles } from "@/enums";

import { SelectWithInput } from "@/components/form/select-with-input";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface IpfsProps {
  node: FilecoinNode;
  role: Roles;
  peers: IPFSPeer[];
  errors?: Record<string, string[] | undefined>;
}

export const Ipfs = ({ node, role, peers, errors }: IpfsProps) => {
  const { ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint } = node;

  const peersOptions = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="IPFS" id="ipfs" />
      <Toggle
        id="ipfsForRetrieval"
        label="Use IPFS For Retrieval"
        defaultChecked={ipfsForRetrieval}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      <Toggle
        id="ipfsOnlineMode"
        label="IPFS Online Mode"
        defaultChecked={ipfsOnlineMode}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      <SelectWithInput
        id="ipfsPeerEndpoint"
        label="IPFS Peer Endpoint"
        disabled={role === Roles.Reader}
        defaultValue={ipfsPeerEndpoint}
        options={peersOptions}
        otherLabel="Use External Peer"
        errors={errors}
        placeholder="Select a peer"
        allowClear
        className="max-w-xs"
      />
    </div>
  );
};
