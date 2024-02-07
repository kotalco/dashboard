"use client";

import { BitcoinNode } from "@/types";
import { Roles } from "@/enums";
import { Heading } from "@/components/ui/heading";

import { Toggle } from "@/components/form/toggle";

interface WalletProps {
  node: BitcoinNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Wallet = ({ node, role, errors }: WalletProps) => {
  const { wallet } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Wallet" id="wallet" />
      <Toggle
        id="wallet"
        label="Wallet"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={wallet}
        description="Load wallet and enable wallet RPC calls"
      />
    </div>
  );
};
