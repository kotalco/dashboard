import { BeaconNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";

interface CheckpointSyncProps {
  node: BeaconNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const CheckpointSync = ({ node, role, errors }: CheckpointSyncProps) => {
  const { checkpointSyncUrl } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Checkpoint Sync" />{" "}
      <Input
        className="max-w-xs"
        id="checkpointSyncUrl"
        label="Checkpoint Sync URL"
        defaultValue={checkpointSyncUrl}
        disabled={role === Roles.Reader}
        errors={errors}
        description={
          <p className="text-sm text-foreground/70">
            Checkpoint sync endpoints available{" "}
            <ExternalLink href="https://eth-clients.github.io/checkpoint-sync-endpoints">
              here
            </ExternalLink>
          </p>
        }
      />
    </div>
  );
};
