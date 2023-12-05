"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { SecretType } from "@/enums";
import { getSelectItems, readSecretsForm } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { createSecret } from "@/actions/create-secret";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

export const CreateSecretForm = () => {
  const searchParams = useSearchParams();
  const defaultSecretType = searchParams.get("type") as SecretType | null;
  const { workspaceId } = useParams();
  const [type, setType] = useState(defaultSecretType || "");
  const { execute, fieldErrors, error } = useAction(createSecret);

  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const data = await readSecretsForm(formData);

    execute({
      name,
      type: type as SecretType,
      workspace_id: workspaceId as string,
      data,
    });
  };

  return (
    <form action={onSubmit} className="max-w-xs space-y-4">
      <Input id="name" label="Secret Name" errors={fieldErrors} />

      <Select
        id="type"
        label="Secret Type"
        defaultValue={type}
        value={type}
        onValueChange={setType}
        placeholder="Select secret type"
        options={getSelectItems(SecretType)}
        errors={fieldErrors}
      />

      {(type === SecretType.Password ||
        type === SecretType["Ethereum Keystore"]) && (
        <Input id="data.password" label="Password" errors={fieldErrors} />
      )}

      {(type === SecretType["Execution Client Private Key"] ||
        type === SecretType["IPFS Cluster Peer Key"] ||
        type === SecretType["IPFS Swarm Key"] ||
        type === SecretType["Polkadot Private Key"] ||
        type === SecretType["NEAR Private Key"] ||
        type === SecretType["Stacks Private Key"]) && (
        <Textarea id="data.key" label="Key" errors={fieldErrors} />
      )}

      {(type === SecretType["IPFS Cluster Secret"] ||
        type === SecretType["JWT Secret"]) && (
        <Textarea id="data.secret" label="Key" errors={fieldErrors} />
      )}

      {type === SecretType["Ethereum Keystore"] && (
        <Input
          id="data.keystore"
          label="Keystore"
          errors={fieldErrors}
          type="file"
          accept="application/json"
          className="cursor-pointer file:cursor-pointer file:bg-secondary hover:file:bg-secondary/50 file:px-4 file:mr-4 text-foreground/50 p-0 h-full file:h-10"
        />
      )}

      {type === SecretType["TLS Certificate"] && (
        <>
          <Textarea id="data.tls/key" label="TLS Key" errors={fieldErrors} />
          <Textarea
            id="data.tls/crt"
            label="TLS Certificate"
            errors={fieldErrors}
          />
        </>
      )}

      <SubmitError error={error} />
      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
