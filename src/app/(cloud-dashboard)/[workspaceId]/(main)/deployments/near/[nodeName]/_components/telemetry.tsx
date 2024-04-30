import { NEARNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { Heading } from "@/components/ui/heading";

interface TelemetryProps {
  node: NEARNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Telemetry = ({ node, role, errors }: TelemetryProps) => {
  const { telemetryURL } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Telemetry" id="telemetry" />
      <Input
        id="telemetryURL"
        label="Telemetry Service URL"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={telemetryURL}
        className="max-w-xs"
      />
    </div>
  );
};
