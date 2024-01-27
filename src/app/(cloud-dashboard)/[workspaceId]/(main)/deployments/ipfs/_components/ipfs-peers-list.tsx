import { IPFSPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";

interface IPFSPeersListProps {
  workspaceId: string;
}

export const IPFSPeersList = async ({ workspaceId }: IPFSPeersListProps) => {
  const { data } = await getNodes<IPFSPeer>(workspaceId, "/ipfs/peers");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/ipfs.svg"
        title="No IPFS Peers"
        description="IPFS Peer stores, retrieves and pins content from the IPFS p2p network."
        createUrl={`/${workspaceId}/deployments/ipfs/peers/new`}
        buttonText="New IPFS Peer"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (peer) => {
    const { versions } = await getClientVersions(
      {
        protocol: "ipfs",
        component: "peer",
        client: "kubo",
      },
      peer.image
    );

    const currentVersionName = versions.find(
      (version) => version.image === peer.image
    )?.name;
    return { ...peer, version: currentVersionName };
  });

  const peers = await Promise.all(promises);

  const mainNodesInfo = peers.map(({ name, createdAt, version }) => ({
    name,
    network: "Public Swarm",
    client: "Kubo",
    url: `/${workspaceId}/deployments/ipfs/peers/${name}`,
    createdAt,
    version,
  }));

  return <DeploymentsList data={mainNodesInfo} />;
};
