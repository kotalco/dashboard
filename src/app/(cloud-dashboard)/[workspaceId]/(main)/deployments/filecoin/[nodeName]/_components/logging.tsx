import { FilecoinNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface LoggingProps {
  node: FilecoinNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Logging = ({ node, role, errors }: LoggingProps) => {
  const { disableMetadataLog } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Logs" />
      <Toggle
        id="disableMetadataLog"
        label="Disable Metadata Logs"
        disabled={role === Roles.Reader}
        defaultChecked={disableMetadataLog}
        errors={errors}
      />
    </div>
  );
};
