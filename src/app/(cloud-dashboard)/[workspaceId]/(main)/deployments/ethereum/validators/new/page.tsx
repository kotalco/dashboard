import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { BeaconNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

import { Heading } from "@/components/ui/heading";

import { CreateValidatorNodeForm } from "./_components/create-validator-node-form";

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
    <div className="space-y-8">
      <Heading title="New Validator Node" />
      <CreateValidatorNodeForm
        images={component}
        beaconNodes={data}
        passwords={passwords}
        keystores={keystores}
      />
    </div>
  );
}
