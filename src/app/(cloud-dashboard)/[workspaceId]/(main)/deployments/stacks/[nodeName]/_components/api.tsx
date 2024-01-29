import { StacksNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: StacksNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, errors }: ApiProps) => {
  const { rpc } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" />
      <Toggle
        id="rpc"
        label="JSON-RPC Server"
        defaultChecked={rpc}
        disabled={role === Roles.Reader}
        errors={errors}
      />
    </div>
  );
};
