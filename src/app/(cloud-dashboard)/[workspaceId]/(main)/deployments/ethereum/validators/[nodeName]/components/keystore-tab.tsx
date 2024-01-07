"use client";

import { useParams } from "next/navigation";

import { OptionType, ValidatorNode } from "@/types";
import { Roles, SecretType, ValidatorClients } from "@/enums";
import { editKeystore } from "@/actions/edit-validator";
import { useAction } from "@/hooks/use-action";

import { MultiSelect } from "@/components/form/multi-select";
import { Select } from "@/components/form/select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface KeystoreTabProps {
  node: ValidatorNode;
  role: Roles;
  ethereumKeystores: OptionType[];
  passwords: OptionType[];
}

export const KeystoreTab: React.FC<KeystoreTabProps> = ({
  node,
  role,
  ethereumKeystores,
  passwords,
}) => {
  const { client, keystores, walletPasswordSecretName, name } = node;
  const { workspaceId } = useParams();

  const { execute, fieldErrors, error, success } = useAction(editKeystore);

  const onSubmit = (formData: FormData) => {
    const keystores = formData.getAll("keystores") as [string, ...string[]];
    const walletPasswordSecretName = formData.get(
      "walletPasswordSecretName"
    ) as string;

    execute(
      { keystores, walletPasswordSecretName, client },
      { name: name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <MultiSelect
        id="keystores"
        label="Ethereum Keystores"
        disabled={role === Roles.Reader}
        defaultValue={keystores.map(({ secretName }) => secretName)}
        placeholder="Select keystores"
        options={ethereumKeystores}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Ethereum Keystore"]}`,
          title: "Create New Keystore",
        }}
        errors={fieldErrors}
        className="max-w-sm"
      />

      {client === ValidatorClients["Prysatic Labs Prysm"] && (
        <Select
          id="walletPasswordSecretName"
          label="Prysm Client Wallet Password"
          disabled={role === Roles.Reader}
          className="max-w-sm"
          defaultValue={walletPasswordSecretName}
          placeholder="Select a Password"
          options={passwords}
          link={{
            href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
            title: "Create New Password",
          }}
          errors={fieldErrors}
        />
      )}

      <SubmitSuccess success={success}>
        Keystore settings has been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
