import { ValidatorNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { Heading } from "@/components/ui/heading";

interface GraffitiProps {
  node: ValidatorNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Graffiti = ({ node, role, errors }: GraffitiProps) => {
  const { graffiti } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Graffiti" id="graffiti" />
      <Input
        id="graffiti"
        label="Graffiti"
        errors={errors}
        defaultValue={graffiti}
        disabled={role === Roles.Reader}
        className="max-w-xs"
      />
    </div>
  );
};
