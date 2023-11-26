"use client";

import { useParams } from "next/navigation";

import { TabsFooter } from "@/components/ui/tabs";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { BitcoinNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editBitcoinWallet } from "@/actions/edit-bitcoin";

interface WalletTabProps {
  node: BitcoinNode;
  role: Roles;
}

export const WalletTab: React.FC<WalletTabProps> = ({ node, role }) => {
  const { wallet, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editBitcoinWallet);

  const onSubmit = (formData: FormData) => {
    const wallet = formData.get("wallet") === "on";
    execute({ wallet }, { name: name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="wallet"
        label="Wallet"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultChecked={wallet}
        description="Load wallet and enable wallet RPC calls"
      />

      <SubmitSuccess success={success}>
        Wallet settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <TabsFooter>
          <SubmitButton data-testid="submit" type="submit">
            Save
          </SubmitButton>
        </TabsFooter>
      )}
    </form>
  );
};
