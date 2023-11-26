import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { IPFSPeersClient } from "./components/ipfs-peers-client";
import { IPFSClusterPeersClient } from "./components/ipfs-cluster-peers-client";
import { Roles } from "@/enums";
import { ButtonGroup } from "@/components/ui/button-group";

export default async function IPFSPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: {
    deployment: "peers" | "cluster-peers";
  };
}) {
  const menu = [
    {
      title: "Peers",
      href: `/${params.workspaceId}/deployments/ipfs/peers/new`,
    },
    {
      title: "Cluster Peers",
      href: `/${params.workspaceId}/deployments/ipfs/cluster-peers/new`,
    },
  ];

  const { data: ipfsPeers, count: ipfsPeersCount } = await getNodes<IPFSPeer>(
    params.workspaceId,
    "/ipfs/peers"
  );

  const { data: ipfsClusterPeers, count: ipfsClusterPeersCount } =
    await getNodes<IPFSClusterPeer>(params.workspaceId, "/ipfs/clusterpeers");

  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="IPFS Deployments" />
          {role !== Roles.Reader && (
            <ButtonGroup title="Create New" menu={menu} />
          )}
        </div>
        <Tabs defaultValue={searchParams.deployment || "peers"}>
          <TabsList>
            <TabsTrigger value="peers">
              Peers
              {!!ipfsPeersCount && (
                <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
                  {ipfsPeersCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cluster-peers">
              Cluster Peers
              {!!ipfsClusterPeersCount && (
                <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
                  {ipfsClusterPeersCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="peers">
            <IPFSPeersClient data={ipfsPeers} role={role} />
          </TabsContent>
          <TabsContent value="cluster-peers">
            <IPFSClusterPeersClient data={ipfsClusterPeers} role={role} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
