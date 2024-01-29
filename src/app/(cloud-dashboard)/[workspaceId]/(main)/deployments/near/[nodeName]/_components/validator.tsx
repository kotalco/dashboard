"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface ValidatorProps {
  node: NEARNode;
  role: Roles;
  privateKeys: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Validator = ({
  node,
  role,
  privateKeys,
  errors,
}: ValidatorProps) => {
  const { validatorSecretName } = node;
  const { workspaceId } = useParams();
  const [secret, setSecret] = useState(validatorSecretName);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Validator" />
      <Select
        id="validatorSecretName"
        label="Validator Key"
        disabled={role === Roles.Reader}
        className="max-w-xs"
        defaultValue={secret}
        value={secret}
        onValueChange={setSecret}
        options={privateKeys}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["NEAR Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setSecret("") }}
        errors={errors}
        placeholder="Select a Secret"
      />
    </div>
  );
};
