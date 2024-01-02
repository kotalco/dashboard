"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, PolkadotNode } from "@/types";
import { PolkadotSyncModes, Roles, SecretType } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { editNetworking } from "@/actions/edit-polkadot";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Toggle } from "@/components/form/toggle";

interface NetWorkingTabProps {
  node: PolkadotNode;
  role: Roles;
  secrets: OptionType[];
}

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const {
    nodePrivateKeySecretName,
    p2pPort,
    syncMode,
    retainedBlocks,
    pruning,
    name,
  } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);
  const { execute, fieldErrors, error, success } = useAction(editNetworking);

  const onSubmit = (formData: FormData) => {
    const p2pPort = Number(formData.get("p2pPort"));
    const syncMode = formData.get("syncMode") as PolkadotSyncModes;
    const retainedBlocks = Number(formData.get("retainBlocks"));

    execute(
      {
        nodePrivateKeySecretName: privateKey,
        p2pPort,
        syncMode,
        retainedBlocks,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        placeholder="Select a Secret"
        disabled={role === Roles.Reader}
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        options={secrets}
        errors={fieldErrors}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Polkadot Private Key"]}`,
          title: "Create New Private Key",
        }}
        className="max-w-xs"
        clear={{ onClear: () => setPrivateKey("") }}
      />

      <Input
        id="p2pPort"
        label="P2P Port"
        disabled={role === Roles.Reader}
        defaultValue={p2pPort}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Select
        id="syncMode"
        label="Sync Mode"
        disabled={role === Roles.Reader}
        defaultValue={syncMode}
        options={getSelectItems(PolkadotSyncModes)}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Toggle id="pruning" label="Pruning" disabled defaultChecked={pruning} />

      <Input
        id="retainBlocks"
        label="Retain Blocks"
        disabled={role === Roles.Reader}
        defaultValue={retainedBlocks}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Networking settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
