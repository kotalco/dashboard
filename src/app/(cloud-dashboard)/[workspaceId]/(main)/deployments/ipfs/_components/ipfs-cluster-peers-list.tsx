import { IPFSClusterPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";

interface IPFSClusterPeersListProps {
  workspaceId: string;
}

export const IPFSClusterPeersList = async ({
  workspaceId,
}: IPFSClusterPeersListProps) => {
  const { data } = await getNodes<IPFSClusterPeer>(
    workspaceId,
    "/ipfs/clusterpeers"
  );

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/ipfs.svg"
        title="No IPFS Cluster Peers"
        description="IPFS Cluster peer provides data orchestration across a swarm of IPFS daemons by allocating, replicating and tracking a global pinset distributed among multiple peers."
        createUrl={`/${workspaceId}/deployments/ipfs/cluster-peers/new`}
        buttonText="New IPFS Cluster Peer"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (peer) => {
    const { versions } = await getClientVersions(
      {
        protocol: "ipfs",
        component: "clusterPeer",
        client: "ipfs-cluster",
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
    client: "IPFS Cluster Service",
    url: `/${workspaceId}/deployments/ipfs/cluster-peers/${name}`,
    createdAt,
    version,
  }));

  return <DeploymentsList data={mainNodesInfo} />;
};
