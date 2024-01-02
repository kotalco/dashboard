"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editPrometheus } from "@/actions/edit-polkadot";

import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface PrometheusTabProps {
  node: PolkadotNode;
  role: Roles;
}

export const PrometheusTab: React.FC<PrometheusTabProps> = ({ node, role }) => {
  const { prometheusPort, prometheus, name } = node;
  const [isPrometheus, setIsPrometheus] = useState(prometheus);
  const { workspaceId } = useParams();
  const { execute, success, fieldErrors, error } = useAction(editPrometheus);

  const onSubmit = (formData: FormData) => {
    const prometheusPort = Number(formData.get("prometheusPort"));

    execute(
      {
        prometheusPort,
        prometheus: isPrometheus,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="prometheus"
        label="Prometheus"
        disabled={role === Roles.Reader}
        defaultChecked={isPrometheus}
        checked={isPrometheus}
        onCheckedChange={setIsPrometheus}
      />

      <Input
        id="prometheusPort"
        label="Prometheus Port"
        disabled={role === Roles.Reader || !isPrometheus}
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
