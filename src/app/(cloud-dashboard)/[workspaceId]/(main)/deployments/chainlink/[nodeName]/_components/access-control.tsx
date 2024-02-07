import { ChainlinkNode } from "@/types";
import { Roles } from "@/enums";

import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/ui/heading";

interface AccessControlProps {
  node: ChainlinkNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const AccessControl = ({ node, role, errors }: AccessControlProps) => {
  const { corsDomains } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Access Control" id="access-control" />
      <Textarea
        id="corsDomains"
        label="CORS Domains"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={corsDomains}
        description="One domain per line"
        className="max-w-xs"
      />
    </div>
  );
};
