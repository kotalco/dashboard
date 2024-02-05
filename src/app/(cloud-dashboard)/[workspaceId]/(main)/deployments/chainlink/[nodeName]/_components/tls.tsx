"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface TlsProps {
  node: ChainlinkNode;
  role: Roles;
  tlss: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Tls = ({ node, role, tlss, errors }: TlsProps) => {
  const { certSecretName, tlsPort, secureCookies } = node;
  const { workspaceId } = useParams();
  const [secured, setSecured] = useState(secureCookies);
  const [certificate, setCertificate] = useState(certSecretName);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="TLS" />
      <Select
        id="certSecretName"
        label="Certificate"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={certSecretName}
        options={tlss}
        placeholder="Select a certificate"
        className="max-w-xs"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["TLS Certificate"]}`,
          title: "Create New Certificate",
        }}
        value={certificate}
        onValueChange={setCertificate}
        clear={{
          onClear: () => {
            setCertificate("");
            setSecured(false);
          },
        }}
      />

      <Toggle
        id="secureCookies"
        label="Secure Cookies"
        disabled={role === Roles.Reader || !certificate}
        defaultChecked={secureCookies}
        onCheckedChange={setSecured}
        checked={secured}
        errors={errors}
      />
    </div>
  );
};
