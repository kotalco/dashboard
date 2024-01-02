"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editTelemetry } from "@/actions/edit-polkadot";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Toggle } from "@/components/form/toggle";

interface TelemetryTabProps {
  node: PolkadotNode;
  role: Roles;
}

export const TelemetryTab: React.FC<TelemetryTabProps> = ({ node, role }) => {
  const { telemetryURL, telemetry, name } = node;
  const { workspaceId } = useParams();
  const [isTelemetry, setIsTelemetry] = useState(telemetry);

  const { execute, success, fieldErrors, error } = useAction(editTelemetry);

  const onSubmit = (formData: FormData) => {
    const telemetryURL = formData.get("telemetryURL") as string;
    execute(
      {
        telemetryURL,
        telemetry: isTelemetry,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="telemetry"
        label="Telemetry"
        defaultChecked={isTelemetry}
        checked={isTelemetry}
        onCheckedChange={setIsTelemetry}
        errors={fieldErrors}
        disabled={role === Roles.Reader}
      />

      <Input
        className="max-w-xs"
        id="telemetryURL"
        label="Telemetry Service URL"
        disabled={role === Roles.Reader || !isTelemetry}
        errors={fieldErrors}
        defaultValue={telemetryURL}
      />

      <SubmitSuccess success={success}>
        Telemetry settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
