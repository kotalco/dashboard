"use client";

import { useParams } from "next/navigation";

import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: ChainlinkNode;
  role: Roles;
  passwords: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, passwords, errors }: ApiProps) => {
  const { api, apiCredentials } = node;
  const { workspaceId } = useParams();

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" />
      <Toggle
        id="api"
        label="API"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={api}
      />

      <Input
        id="apiCredentials.email"
        label="Email"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={apiCredentials.email}
        className="max-w-xs"
      />

      <Select
        id="apiCredentials.passwordSecretName"
        label="Password"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={apiCredentials.passwordSecretName}
        options={passwords}
        placeholder="Select a password"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
          title: "Create New Password",
        }}
        className="max-w-xs"
      />
    </div>
  );
};
