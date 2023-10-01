"use client";

import { useParams } from "next/navigation";

import { NoResult } from "@/components/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { IPFSPeer } from "@/types";
import { Roles } from "@/enums";

interface IPFSPeersClientProps {
  data: IPFSPeer[];
  role: Roles;
}

export const IPFSPeersClient: React.FC<IPFSPeersClientProps> = ({
  data,
  role,
}) => {
  const params = useParams();

  const mainNodesInfo = data.map(({ name }) => ({
    name,
    network: "public-swarm",
    client: "kubo",
    url: `/${params.workspaceId}/deployments/ipfs/peers/${name}`,
  }));

  return (
    <>
      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          className="border-0"
          imageUrl="/images/ipfs.svg"
          title="No IPFS Peers"
          description="IPFS Peer stores, retrieves and pins content from the IPFS p2p network."
          createUrl={`/${params.workspaceId}/deployments/ipfs/peers/new`}
          buttonText="Create New IPFS Peer"
          role={role}
        />
      )}
    </>
  );
};
