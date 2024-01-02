"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, StacksNode } from "@/types";
import { Roles, SecretType } from "@/enums";
import { editMining } from "@/actions/edit-stacks";
import { useAction } from "@/hooks/use-action";

import { Select } from "@/components/form/select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { Toggle } from "@/components/form/toggle";

interface MiningTabProps {
  node: StacksNode;
  secrets: OptionType[];
  role: Roles;
}

export const MiningTab: React.FC<MiningTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const { mineMicroBlocks, miner, seedPrivateKeySecretName, name } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(seedPrivateKeySecretName);
  const { execute, success, fieldErrors, error } = useAction(editMining);

  const onSubmit = (formData: FormData) => {
    const mineMicroBlocks = formData.get("mineMicroBlocks") === "on";
    const miner = formData.get("miner") === "on";

    execute(
      { mineMicroBlocks, miner, seedPrivateKeySecretName: privateKey },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="miner"
        label="Miner"
        disabled={role === Roles.Reader}
        defaultChecked={miner}
        errors={fieldErrors}
      />

      <Toggle
        id="mineMicroBlocks"
        label="Mine Micro Blocks"
        disabled={role === Roles.Reader}
        defaultChecked={mineMicroBlocks}
        errors={fieldErrors}
      />

      <Select
        id="seedPrivateKeySecretName"
        label="Seed Private Key"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={privateKey}
        options={secrets}
        placeholder="Select a private key"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Stacks Private Key"]}`,
          title: "Create New Private Key",
        }}
        value={privateKey}
        onValueChange={setPrivateKey}
        clear={{
          onClear: () => {
            setPrivateKey("");
          },
        }}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Mining settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
