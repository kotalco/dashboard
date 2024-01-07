"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editValidator } from "@/actions/edit-near";

import { Select } from "@/components/form/select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface ValidatorTabProps {
  node: NEARNode;
  role: Roles;
  secrets: OptionType[];
}

export const ValidatorTab: React.FC<ValidatorTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const { validatorSecretName, name } = node;
  const { workspaceId } = useParams();
  const [secret, setSecret] = useState(validatorSecretName);
  const { execute, fieldErrors, error, success } = useAction(editValidator);

  const onSubmit = (formData: FormData) => {
    const validatorSecretName = formData.get("validatorSecretName") as string;

    execute(
      { validatorSecretName },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="validatorSecretName"
        label="Validator Key"
        disabled={role === Roles.Reader}
        className="max-w-xs"
        defaultValue={secret}
        value={secret}
        onValueChange={setSecret}
        options={secrets}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["NEAR Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setSecret("") }}
        errors={fieldErrors}
        placeholder="Select a Secret"
      />

      <SubmitSuccess success={success}>
        Validator settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
