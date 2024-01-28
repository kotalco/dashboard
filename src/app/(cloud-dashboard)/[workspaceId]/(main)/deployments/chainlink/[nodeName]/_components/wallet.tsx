import { useParams } from "next/navigation";

import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface WalletProps {
  node: ChainlinkNode;
  role: Roles;
  passwords: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Wallet = ({ node, role, passwords }: WalletProps) => {
  const { keystorePasswordSecretName } = node;
  const { workspaceId } = useParams();

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Wallet" />
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
        className="max-w-xs"
      />
    </div>
  );
};
