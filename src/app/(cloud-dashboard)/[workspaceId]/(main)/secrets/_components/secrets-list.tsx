import { Suspense } from "react";

import { getSecrets } from "@/services/get-secrets";
import { getEnumKey } from "@/lib/utils";
import { SecretType } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateSecretButton } from "./create-secret-button";
import { DeleteSecretsButtons } from "./delete-secrets-buttons";

interface SecretsListProps {
  workspaceId: string;
}

export const SecretsList = async ({ workspaceId }: SecretsListProps) => {
  const { data } = await getSecrets(workspaceId);

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/key.svg"
        title="No Secrets"
        description="Secret stores sensetive data into secure location that can be referenced by multiple nodes."
        createUrl={`/${workspaceId}/secrets/new`}
        buttonText="New Secret"
        workspaceId={workspaceId}
      />
    );
  }

  const secrets = data.map(({ type, name, createdAt }) => ({
    type: getEnumKey(SecretType, type),
    name,
    createdAt,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateSecretButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <div className="col-span-12 relative">
        <DeploymentsList data={secrets} />
        <DeleteSecretsButtons secrets={data} workspaceId={workspaceId} />
      </div>
    </>
  );
};
