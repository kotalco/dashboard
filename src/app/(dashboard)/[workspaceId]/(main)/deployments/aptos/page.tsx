import { getWorkspace } from "@/services/get-workspace";
import { getAptosNodes } from "@/services/get-aptos-nodes";
import { AptosClient } from "./components/client";

export default async function SecretsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const nodes = await getAptosNodes(params.workspaceId);
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <AptosClient data={nodes} role={role} />
      </div>
    </div>
  );
}
