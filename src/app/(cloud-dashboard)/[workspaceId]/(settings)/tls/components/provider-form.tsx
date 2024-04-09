"use client";

import { useState } from "react";

import { useAction } from "@/hooks/use-action";
import { editProvider } from "@/actions/edit-provider";
import { getSelectItems } from "@/lib/utils";
import { Providers } from "@/enums";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

export const ProviderForm = () => {
  const [provider, setProvider] = useState("letsencrypt");

  const { execute, success, error, fieldErrors } = useAction(editProvider);

  const onSubmit = (formData: FormData) => {
    const cert = formData.get("cert");
    console.log("Cert: ", cert);
    const key = formData.get("key");
    console.log("Key: ", key);
    execute(formData);
  };

  return (
    <form action={onSubmit} className="space-y-4 max-w-xs">
      <Select
        id="tls_provider"
        label="Certificate Provider"
        value={provider}
        onValueChange={setProvider}
        placeholder="Select provider"
        options={getSelectItems(Providers)}
        errors={fieldErrors}
      />

      {provider === Providers["Paid TLS Certificate"] && (
        <>
          <Input
            id="cert"
            label="domain.crt"
            errors={fieldErrors}
            type="file"
            accept="application/x-x509-ca-cert"
            className="cursor-pointer file:cursor-pointer file:bg-secondary hover:file:bg-secondary/50 file:px-4 file:mr-4 text-foreground/50 p-0 h-full file:h-10"
          />
          <Input
            id="key"
            label="domain.key"
            errors={fieldErrors}
            type="file"
            accept="application/x-iwork-keynote-sffkey"
            className="cursor-pointer file:cursor-pointer file:bg-secondary hover:file:bg-secondary/50 file:px-4 file:mr-4 text-foreground/50 p-0 h-full file:h-10"
          />
        </>
      )}

      <SubmitError error={error} />

      <SubmitSuccess success={success}>
        You provider settings has been changed successfully.
      </SubmitSuccess>

      <SubmitButton disabled={success}>Update</SubmitButton>
    </form>
  );
};
