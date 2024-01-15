"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editNetworkng } from "@/actions/edit-near";

import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface NetWorkingTabProps {
  node: NEARNode;
  role: Roles;
  secrets: OptionType[];
}

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const { nodePrivateKeySecretName, minPeers, p2pPort, bootnodes, name } = node;
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editNetworkng);

  const onSubmit = (formData: FormData) => {
    const nodePrivateKeySecretName = formData.get(
      "nodePrivateKeySecretName"
    ) as string;
    const minPeers = Number(formData.get("minPeers"));
    const p2pPort = Number(formData.get("p2pPort"));
    const bootnodes = formData.get("bootnodes") as string;

    execute(
      { nodePrivateKeySecretName, minPeers, p2pPort, bootnodes },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        disabled={role === Roles.Reader}
        placeholder="Select a Secret"
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        options={secrets}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["NEAR Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setPrivateKey("") }}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Input
        id="minPeers"
        label="Minimum Peers"
        disabled={role === Roles.Reader}
        defaultValue={minPeers}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Input
        id="p2pPort"
        label="P2P Port"
        disabled={role === Roles.Reader}
        defaultValue={p2pPort}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Textarea
        id="bootnodes"
        label="Boot Nodes"
        disabled={role === Roles.Reader}
        defaultValue={bootnodes?.join("\n")}
        errors={fieldErrors}
        description="One node URL per line"
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Networking settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
