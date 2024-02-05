import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface PrometheusProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Prometheus = ({ node, role, errors }: PrometheusProps) => {
  const { prometheus } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Prometheus" />{" "}
      <Toggle
        id="prometheus"
        label="Prometheus"
        disabled={role === Roles.Reader}
        defaultChecked={prometheus}
        errors={errors}
      />
    </div>
  );
};
