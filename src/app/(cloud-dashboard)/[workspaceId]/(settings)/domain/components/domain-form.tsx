"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useAction } from "@/hooks/use-action";
import { editDomain } from "@/actions/edit-domain";
import { IPAddress } from "@/types";

import { Input } from "@/components/form/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/form/checkbox";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

interface DomainFormProps {
  ip: IPAddress;
  domainName?: string;
}

export const DomainForm: React.FC<DomainFormProps> = ({ ip, domainName }) => {
  const [count, setCount] = useState(10);
  const [value, setValue] = useState(domainName || "");
  const { execute, success, error, fieldErrors } = useAction(editDomain, {
    onSuccess: ({ domain }) => {
      const interval = setInterval(() => setCount((c) => c - 1), 1000);
      setTimeout(() => {
        window.open(`https://app.${domain}`, "_self");
        clearInterval(interval);
      }, 10000);
    },
  });

  const onSubmit = (formData: FormData) => {
    const isAware = formData.get("isAware") === "on";
    const isUpdated = formData.get("isUpdated") === "on";
    execute({ domain: value, isAware, isUpdated });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input
        className="max-w-xs"
        id="domain"
        label="Domain Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        errors={fieldErrors}
      />

      {value && (
        <Alert className="max-w-lg">
          {ip.ip_address && (
            <AlertDescription>
              Add DNS record of type A that maps <strong>app.{value}</strong> to{" "}
              <strong>{ip.ip_address}</strong>, <br />
              Add DNS record of type A that maps{" "}
              <strong>endpoints.{value}</strong> to{" "}
              <strong>{ip.ip_address}</strong>
            </AlertDescription>
          )}

          {!ip.ip_address && (
            <AlertDescription>
              <p>
                Add DNS record of type CNAME that maps <strong>{value}</strong>{" "}
                to <strong>{ip.host_name}</strong>
              </p>
              <p>
                Add DNS record of type CNAME that maps{" "}
                <strong>*.{value}</strong> to <strong>{ip.host_name}</strong>
              </p>
            </AlertDescription>
          )}
        </Alert>
      )}

      <Checkbox
        id="isUpdated"
        label="I confirm that I have updated my domain DNS records"
        errors={fieldErrors}
      />

      <Checkbox
        id="isAware"
        label="I am aware that updating domain will render old endpoints dysfunctional"
        errors={fieldErrors}
      />

      <SubmitError error={error} />

      <SubmitSuccess success={success}>
        You domain settings has been changed. Please wait while we redirect you
        to your new domain.
      </SubmitSuccess>

      <SubmitButton disabled={success}>
        {success ? (
          <span className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting in{" "}
            {count}s
          </span>
        ) : (
          "Update"
        )}
      </SubmitButton>
    </form>
  );
};
