import { ExecutionClientNode } from "@/types";
import { Roles } from "@/enums";

import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/ui/heading";

interface AccessControlProps {
  node: ExecutionClientNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const AccessControl = ({ node, role, errors }: AccessControlProps) => {
  const { hosts, corsDomains } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Access Control" id="access-control" />
      <Textarea
        id="hosts"
        label="Whitelisted Hosts"
        defaultValue={hosts}
        disabled={role === Roles.Reader}
        errors={errors}
        description="* (asterisk) means trust all hosts"
        tooltip="Server Enforced"
        className="max-w-xs"
      />

      <Textarea
        id="corsDomains"
        label="CORS Domains"
        defaultValue={corsDomains}
        disabled={role === Roles.Reader}
        errors={errors}
        description="* (asterisk) means trust all domains"
        tooltip="Browser Enforced"
        className="max-w-xs"
      />
    </div>
  );
};
