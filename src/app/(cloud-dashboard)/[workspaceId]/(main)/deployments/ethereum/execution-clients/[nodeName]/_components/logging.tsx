import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode } from "@/types";
import { ExecutionClientLogging, Roles } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface LoggingProps {
  node: ExecutionClientNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Logging = ({ node, role, errors }: LoggingProps) => {
  const { logging } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Logging" />{" "}
      <Select
        id="logging"
        label="Verbosity Levels"
        options={getSelectItems(ExecutionClientLogging)}
        defaultValue={logging}
        disabled={role === Roles.Reader}
        errors={errors}
        className="max-w-xs"
      />
    </div>
  );
};
