"use client";

import { useParams } from "next/navigation";

import { NoResult } from "@/components/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { IPFSClusterPeer } from "@/types";
import { BeaconNodeClients, BeaconNodeNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";

interface IPFSClusterPeersClientProps {
  data: IPFSClusterPeer[];
  role: Roles;
}

export const IPFSClusterPeersClient: React.FC<IPFSClusterPeersClientProps> = ({
  data,
  role,
}) => {
  const params = useParams();

  const mainNodesInfo = data.map(({ name }) => ({
    name,
    network: "public-swarm",
    client: "ipfs-cluster-service",
    url: `/${params.workspaceId}/deployments/ipfs/cluster-peers/${name}`,
  }));

  return (
    <>
      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/ipfs.svg"
          title="No IPFS Cluster Peers"
          description="IPFS Cluster peer provides data orchestration across a swarm of IPFS daemons by allocating, replicating and tracking a global pinset distributed among multiple peers."
          createUrl={`/${params.workspaceId}/deployments/ipfs/cluster-peers/new`}
          buttonText="Create New IPFS Cluster Peer"
          role={role}
        />
      )}
    </>
  );
};
