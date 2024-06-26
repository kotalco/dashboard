import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateIPFSClusterPeerForm } from "./_components/create-ipfs-cluster-peer-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { getSecrets } from "@/services/get-secrets";
import { Heading } from "@/components/ui/heading";

export default async function CreateIPFSClusterPeerPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const { data: peers } = await getNodes<IPFSPeer>(
    params.workspaceId,
    "/ipfs/peers"
  );
  const { data: clusterPeers } = await getNodes<IPFSClusterPeer>(
    params.workspaceId,
    "/ipfs/clusterpeers"
  );
  const { options: peerKeys } = await getSecrets(
    workspaceId,
    SecretType["IPFS Cluster Peer Key"]
  );
  const { options: secrets } = await getSecrets(
    workspaceId,
    SecretType["IPFS Cluster Secret"]
  );

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "ipfs",
    component: "clusterPeer",
    client: "ipfs-cluster",
  });

  return (
    <div className="space-y-8">
      <Heading title="New IPFS Cluster Peer" />
      <CreateIPFSClusterPeerForm
        images={versions}
        privateKeys={peerKeys}
        clusterSecrets={secrets}
        peers={peers}
        clsuterPeers={clusterPeers}
      />
    </div>
  );
}
