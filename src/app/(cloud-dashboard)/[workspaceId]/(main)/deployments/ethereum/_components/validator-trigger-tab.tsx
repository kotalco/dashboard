import { getNodes } from "@/services/get-nodes";
import { ValidatorNode } from "@/types";

import { Count } from "@/components/ui/count";

interface ValidatorTriggerTabProps {
  workspaceId: string;
}

export const ValidatorTriggerTab = async ({
  workspaceId,
}: ValidatorTriggerTabProps) => {
  const { count } = await getNodes<ValidatorNode>(
    workspaceId,
    "/ethereum2/validators"
  );

  return (
    <>
      Validators
      {!!count && <Count count={count} />}
    </>
  );
};
