import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateIPFSPeerForm } from "./_components/create-ipfs-peer-form";

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
    <div className="space-y-8">
      <Heading title="New IPFS Peer" />
      <CreateIPFSPeerForm images={versions} />
    </div>
  );
}
