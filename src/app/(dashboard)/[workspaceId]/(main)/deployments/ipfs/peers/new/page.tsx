import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateIPFSPeerForm } from "../components/create-ipfs-peer-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

export default async function CreateNewExecutionClientNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "ipfs",
    component: "peer",
    client: "kubo",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New IPFS Peer</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateIPFSPeerForm images={versions} />
      </CardContent>
    </Card>
  );
}
