"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

import { ChainlinkNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editTLS } from "@/actions/edit-chainlink";

interface TLSTabProps {
  node: ChainlinkNode;
  role: Roles;
  secrets: OptionType[];
}

export const TLSTab: React.FC<TLSTabProps> = ({ node, role, secrets }) => {
  const { certSecretName, tlsPort, secureCookies, name } = node;
  const { workspaceId } = useParams();
  const [secured, setSecured] = useState(secureCookies);
  const [certificate, setCertificate] = useState(certSecretName);
  const { execute, fieldErrors, success, error } = useAction(editTLS);

  const onSubmit = async (formData: FormData) => {
    const certSecretName = formData.get("certSecretName") as string;
    const tlsPort = formData.get("tlsPort") as string;
    const secureCookies = formData.get("secureCookies") === "on";

    await execute(
      { certSecretName, tlsPort: Number(tlsPort), secureCookies },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="certSecretName"
        label="Certificate"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={certSecretName}
        options={secrets}
        placeholder="Select a certificate"
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
        errors={fieldErrors}
      />

      <Input
        id="tlsPort"
        disabled={role === Roles.Reader}
        label="TLS Port"
        errors={fieldErrors}
        defaultValue={tlsPort}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        TLS settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
