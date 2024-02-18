"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ExecutionClientClients, ExecutionClientNetworks } from "@/enums";
import {
  getLatestVersion,
  getSelectItems,
  readSelectWithInputValue,
} from "@/lib/utils";
import { Clients } from "@/types";
import { useAction } from "@/hooks/use-action";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { SelectWithInput } from "@/components/form/select-with-input";
import { createExecutionClient } from "@/actions/create-execution-client";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

export const CreateExecutionClientNodeForm: React.FC<{ images: Clients }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createExecutionClient, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/ethereum`);
      toast.message("Execution client node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const client = formData.get("client") as ExecutionClientClients;
    const network = readSelectWithInputValue("network", formData);

    execute({
      name,
      client,
      network,
      workspace_id: workspaceId as string,
      image: getLatestVersion(images, client)!,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xs space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="client"
        label="Client"
        placeholder="Select Client"
        options={getSelectItems(ExecutionClientClients)}
        errors={fieldErrors}
      />

      <SelectWithInput
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(ExecutionClientNetworks)}
        errors={fieldErrors}
        otherLabel="Other Network"
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
