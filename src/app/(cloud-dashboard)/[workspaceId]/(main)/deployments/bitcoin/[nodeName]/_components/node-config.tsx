"use client";

import { editBitcoinNode } from "@/actions/edit-bitcoin";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import {
  getCheckboxValue,
  getResourcesValues,
  readFieldArray,
} from "@/lib/utils";
import { BitcoinNode, OptionType, RPCUser, Version } from "@/types";
import { useParams } from "next/navigation";
import { Protocol } from "./protocol";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Api } from "./api";
import { Wallet } from "./wallet";
import { Resources } from "@/components/shared/deployments/resources";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface NodeConfigProps {
  node: BitcoinNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  secrets: OptionType[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  secrets,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editBitcoinNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const rpc = getCheckboxValue(formData, "rpc");
    const txIndex = getCheckboxValue(formData, "txIndex");
    const rpcUsers = readFieldArray<RPCUser>(
      { rpcUsers: ["username", "passwordSecretName"] },
      formData
    ) as [RPCUser, ...RPCUser[]];
    const wallet = getCheckboxValue(formData, "wallet");
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      image,
      rpc,
      txIndex,
      rpcUsers,
      wallet,
      cpu,
      cpuLimit,
      memory,
      memoryLimit,
      storage,
      workspaceId,
      name,
    });
  };

  return (
    <form action={onSubmit} className="space-y-16">
      <div className="space-y-4">
        {/* Protocol */}
        <Protocol node={node} />

        {/* Image Version */}
        <ImageVersion
          role={role}
          versions={versions}
          image={image}
          errors={fieldErrors}
        />
      </div>

      {/* API */}
      <Api role={role} errors={fieldErrors} node={node} secrets={secrets} />

      {/* Wallet */}
      <Wallet role={role} errors={fieldErrors} node={node} />

      {/* Resources */}
      <Resources role={role} errors={fieldErrors} node={node} />

      <div className="space-y-4">
        <SubmitSuccess success={success}>
          Your node configrations have been updated successfully.
        </SubmitSuccess>

        <SubmitError error={error} />

        {role !== Roles.Reader && (
          <SubmitButton data-testid="submit" type="submit">
            Update
          </SubmitButton>
        )}
      </div>
    </form>
  );
};
