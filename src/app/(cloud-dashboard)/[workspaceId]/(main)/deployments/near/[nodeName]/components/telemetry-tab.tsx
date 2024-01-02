"use client";

import { useParams } from "next/navigation";

import { NEARNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editTelemetry } from "@/actions/edit-near";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface TelemetryTabProps {
  node: NEARNode;
  role: Roles;
}

export const TelemetryTab: React.FC<TelemetryTabProps> = ({ node, role }) => {
  const { telemetryURL, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editTelemetry);

  const onSubmit = (formData: FormData) => {
    const telemetryURL = formData.get("telemetryURL") as string;
    execute({ telemetryURL }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Input
        id="telemetryURL"
        label="Telemetry Service URL"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={telemetryURL}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Telemetry settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
