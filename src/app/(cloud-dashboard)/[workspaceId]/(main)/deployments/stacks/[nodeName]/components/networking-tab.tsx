"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, StacksNode } from "@/types";
import { Roles, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editNetworking } from "@/actions/edit-stacks";

import { Select } from "@/components/form/select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface NetWorkingTabProps {
  node: StacksNode;
  role: Roles;
  secrets: OptionType[];
}

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const { nodePrivateKeySecretName, name } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);
  const { execute, success, error, fieldErrors } = useAction(editNetworking);

  const onSubmit = () => {
    execute(
      { nodePrivateKeySecretName: privateKey },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
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
        Networking settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
