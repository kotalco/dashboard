"use client";

import { useParams } from "next/navigation";

import { TabsFooter } from "@/components/ui/tabs";
import { Select } from "@/components/form/select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editWallet } from "@/actions/edit-chainlink";

interface WalletTabProps {
  node: ChainlinkNode;
  role: Roles;
  passwords: OptionType[];
}

export const WalletTab: React.FC<WalletTabProps> = ({
  node,
  role,
  passwords,
}) => {
  const { keystorePasswordSecretName, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editWallet);

  const onSubmit = (formData: FormData) => {
    const keystorePasswordSecretName = formData.get(
      "keystorePasswordSecretName"
    ) as string;

    execute(
      { keystorePasswordSecretName },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="keystorePasswordSecretName"
        label="Keystore password"
        disabled={role === Roles.Reader}
        defaultValue={keystorePasswordSecretName}
        placeholder="Select a Password"
        options={passwords}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
          title: "Create New Password",
        }}
        description="For securing access to chainlink wallet"
      />

      <SubmitSuccess success={success}>
        Wallet settings have been updated successfully.
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
