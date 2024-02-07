import { IPFSPeer } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: IPFSPeer;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, errors }: ApiProps) => {
  const { api, gateway } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" id="api" />
      <Toggle
        id="api"
        label="API"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={api}
      />

      <Toggle
        id="gateway"
        label="Gateway"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={gateway}
      />
    </div>
  );
};
