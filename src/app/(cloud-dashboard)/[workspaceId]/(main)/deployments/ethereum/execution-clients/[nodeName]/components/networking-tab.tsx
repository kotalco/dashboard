"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, OptionType, Secret } from "@/types";
import { ExecutionClientSyncMode, Roles, SecretType } from "@/enums";
import { editNetworking } from "@/actions/edit-execution-client";
import { useAction } from "@/hooks/use-action";

import { TabsFooter } from "@/components/ui/tabs";
import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface NetWorkingTabProps {
  node: ExecutionClientNode;
  role: Roles;
  secrets: OptionType[];
}

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const { nodePrivateKeySecretName, syncMode, staticNodes, bootnodes, name } =
    node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState<string | undefined>(
    nodePrivateKeySecretName
  );
  const { execute, fieldErrors, error, success } = useAction(editNetworking);

  const onSubmit = (formData: FormData) => {
    const nodePrivateKeySecretName = privateKey;
    const syncMode = formData.get("syncMode") as ExecutionClientSyncMode;
    const staticNodes = formData.get("staticNodes") as string;
    const bootnodes = formData.get("bootnodes") as string;

    execute(
      { nodePrivateKeySecretName, syncMode, staticNodes, bootnodes },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        options={secrets}
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        placeholder="Select a Secret"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Execution Client Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setPrivateKey("") }}
        className="max-w-xs"
      />

      <Select
        id="syncMode"
        label="Sync Mode"
        options={getSelectItems(ExecutionClientSyncMode)}
        defaultValue={syncMode}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Textarea
        id="staticNodes"
        label="Static Nodes"
        defaultValue={staticNodes}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        description="One enodeURL per line"
        className="max-w-xs"
      />

      <Textarea
        id="bootnodes"
        label="Boot Nodes"
        defaultValue={bootnodes}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        description="One enodeURL per line"
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Networking settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <TabsFooter>
          <SubmitButton>Save</SubmitButton>
        </TabsFooter>
      )}
    </form>
  );
};
