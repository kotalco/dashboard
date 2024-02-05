import { NEARNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface RpcProps {
  node: NEARNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Rpc = ({ node, role, errors }: RpcProps) => {
  const { rpc } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="RPC" />
      <Toggle
        id="rpc"
        label="JSON-RPC Server"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={rpc}
      />
    </div>
  );
};
