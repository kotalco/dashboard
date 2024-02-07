import { Toggle } from "@/components/form/toggle";

import { AptosNode } from "@/types";
import { Roles } from "@/enums";
import { Heading } from "@/components/ui/heading";

interface APITabProps {
  node: AptosNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Api: React.FC<APITabProps> = ({ node, role, errors }) => {
  const { api } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" id="api" />
      <Toggle
        id="api"
        label="REST"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={api}
      />
    </div>
  );
};
