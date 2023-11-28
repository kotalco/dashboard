import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateValidatorNodeForm } from "../components/create-validator-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { BeaconNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

export default async function CreateNewValidatorNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options: passwords } = await getSecrets(
    workspaceId,
    SecretType.Password
  );
  const { options: keystores } = await getSecrets(
    workspaceId,
    SecretType["Ethereum Keystore"]
  );

  const { data } = await getNodes<BeaconNode>(
    params.workspaceId,
    "/ethereum2/beaconnodes"
  );

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "ethereum",
    component: "validatorClient",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Validator Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateValidatorNodeForm
          images={component}
          beaconNodes={data}
          passwords={passwords}
          keystores={keystores}
        />
      </CardContent>
    </Card>
  );
}
