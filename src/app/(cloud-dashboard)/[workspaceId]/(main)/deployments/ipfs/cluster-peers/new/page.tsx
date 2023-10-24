import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateIPFSClusterPeerForm } from "../components/create-ipfs-cluster-peer-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { getSecrets } from "@/services/get-secrets";

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
  const secrets = await getSecrets(workspaceId);
  const privateKeys = secrets.filter(
    ({ type }) => type === SecretType["IPFS Cluster Peer Key"]
  );
  const clusterSecrets = secrets.filter(
    ({ type }) => type === SecretType["IPFS Cluster Secret"]
  );

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "ipfs",
    component: "clusterPeer",
    client: "ipfs-cluster",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Cluster Peer</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateIPFSClusterPeerForm
          images={versions}
          privateKeys={privateKeys}
          clusterSecrets={clusterSecrets}
          peers={peers}
          clsuterPeers={clusterPeers}
        />
      </CardContent>
    </Card>
  );
}
