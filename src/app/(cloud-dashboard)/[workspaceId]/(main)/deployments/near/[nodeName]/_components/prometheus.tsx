import { NEARNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { Heading } from "@/components/ui/heading";

interface PrometheusProps {
  node: NEARNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Prometheus = ({ node, role, errors }: PrometheusProps) => {
  const { prometheusPort } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Prometheus" />
      <Input
        id="prometheusPort"
        label="Prometheus Port"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={prometheusPort}
        className="max-w-xs"
      />
    </div>
  );
};
