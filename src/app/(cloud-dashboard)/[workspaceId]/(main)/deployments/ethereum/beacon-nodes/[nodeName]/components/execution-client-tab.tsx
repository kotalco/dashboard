"use client";

import { useParams } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { edeitExecutionClient } from "@/actions/edit-beacon-node";
import { readSelectWithInputValue } from "@/lib/utils";

import { BeaconNode, ExecutionClientNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { SelectWithInput } from "@/components/form/select-with-input";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface ExecutionClientTabProps {
  node: BeaconNode;
  executionClients: ExecutionClientNode[];
  role: Roles;
  secrets: OptionType[];
}

export const ExecutionClientTab: React.FC<ExecutionClientTabProps> = ({
  node,
  role,
  secrets,
  executionClients,
}) => {
  const { executionEngineEndpoint, jwtSecretName, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } =
    useAction(edeitExecutionClient);

  const activeExecutionClients = executionClients
    .filter(({ engine }) => engine)
    .map(({ enginePort, name }) => ({
      label: name,
      value: `http://${name}:${enginePort}`,
    }));

  const onSubmit = (formData: FormData) => {
    const executionEngineEndpoint = readSelectWithInputValue(
      "executionEngineEndpoint",
      formData
    );
    const jwtSecretName = formData.get("jwtSecretName") as string;
    execute(
      { executionEngineEndpoint, jwtSecretName },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <SelectWithInput
        id="executionEngineEndpoint"
        label="Execution Engine Endpoint"
        placeholder="Select a Node"
        disabled={role === Roles.Reader}
        defaultValue={executionEngineEndpoint}
        options={activeExecutionClients}
        otherLabel="Use External Node"
        description="Nodes must have activated engine port"
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Select
        id="jwtSecretName"
        label="JWT Secret"
        placeholder="Select a Secret"
        disabled={role === Roles.Reader}
        defaultValue={jwtSecretName}
        errors={fieldErrors}
        options={secrets}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`,
          title: "Create New JWT Secret",
        }}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Execution client settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
