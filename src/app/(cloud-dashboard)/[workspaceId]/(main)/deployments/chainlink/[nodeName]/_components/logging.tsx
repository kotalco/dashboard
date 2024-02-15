import { getSelectItems } from "@/lib/utils";
import { ChainlinkNode } from "@/types";
import { ChainlinkLogging, Roles } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface LoggingProps {
  node: ChainlinkNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Logging = ({ node, role, errors }: LoggingProps) => {
  const { logging } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Logs" id="logs" />
      <Select
        id="logging"
        label="Verbosity Levels"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={logging}
        options={getSelectItems(ChainlinkLogging)}
        className="max-w-xs"
      />
    </div>
  );
};
