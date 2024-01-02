"use client";

import { useParams } from "next/navigation";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { useAction } from "@/hooks/use-action";
import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";
import { editAPI } from "@/actions/edit-chainlink";

interface APITabProps {
  node: ChainlinkNode;
  role: Roles;
  secrets: OptionType[];
}

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const { api, apiCredentials, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const onSubmit = async (formData: FormData) => {
    const api = formData.get("api") === "on";
    const apiCredentials = {
      email: formData.get("apiCredentials.email") as string,
      passwordSecretName: formData.get(
        "apiCredentials.passwordSecretName"
      ) as string,
    };

    await execute(
      { api, apiCredentials },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="api"
        label="API"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultChecked={api}
      />

      <Input
        id="apiCredentials.email"
        label="Email"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={apiCredentials.email}
        className="max-w-xs"
      />

      <Select
        id="apiCredentials.passwordSecretName"
        label="Password"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={apiCredentials.passwordSecretName}
        options={secrets}
        placeholder="Select a password"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
          title: "Create New Password",
        }}
      />

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
