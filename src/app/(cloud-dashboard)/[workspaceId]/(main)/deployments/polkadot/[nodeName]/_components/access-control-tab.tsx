import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/ui/heading";

interface AccessControlProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const AccessControl = ({ node, role, errors }: AccessControlProps) => {
  const { corsDomains } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Access Control" />

      <Textarea
        id="corsDomains"
        label="CORS Domains"
        disabled={role === Roles.Reader}
        className="max-w-xs"
        description="One domain per line"
        errors={errors}
        defaultValue={corsDomains.join("\n")}
      />
    </div>
  );
};
