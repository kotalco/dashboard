import { format, parseISO } from "date-fns";

import { getSecrets } from "@/services/get-secrets";
import { getEnumKey } from "@/lib/utils";
import { SecretsClient } from "./components/client";
import { SecretType } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";

export default async function SecretsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getSecrets(params.workspaceId);
  const { role } = await getWorkspace(params.workspaceId);
  const formattedSecrets = data.map(({ type, name, createdAt }) => ({
    type: getEnumKey(SecretType, type),
    name,
    createdAt: format(parseISO(createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SecretsClient data={formattedSecrets} role={role} />
      </div>
    </div>
  );
}
