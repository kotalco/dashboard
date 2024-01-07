"use client";

import { useParams } from "next/navigation";

import { NEARNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editPrometheus } from "@/actions/edit-near";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";

interface PrometheusTabProps {
  node: NEARNode;
  role: Roles;
}

export const PrometheusTab: React.FC<PrometheusTabProps> = ({ node, role }) => {
  const { prometheusPort, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editPrometheus);

  const onSubmit = (formData: FormData) => {
    const prometheusPort = Number(formData.get("prometheusPort"));
    execute({ prometheusPort }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Input
        id="prometheusPort"
        label="Prometheus Port"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={prometheusPort}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Prometheus settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
