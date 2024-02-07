import { IPFSPeer } from "@/types";
import { IPFSRouting, Roles } from "@/enums";
import { getSelectItems } from "@/lib/utils";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface RoutingProps {
  node: IPFSPeer;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Routing = ({ node, role, errors }: RoutingProps) => {
  const { routing } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Routing" id="routing" />
      <Select
        id="routing"
        label="Content Routing Mechanism"
        disabled={role === Roles.Reader}
        defaultValue={routing}
        options={getSelectItems(IPFSRouting)}
        errors={errors}
        className="max-w-xs"
      />
    </div>
  );
};
