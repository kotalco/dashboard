"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getLatestVersion,
  getSelectItems,
  readSelectWithInputValue,
} from "@/lib/utils";
import { Clients, ExecutionClientNode, OptionType } from "@/types";
import { BeaconNodeClients, BeaconNodeNetworks, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { createBeaconNode } from "@/actions/create-beaconnode";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { SelectWithInput } from "@/components/form/select-with-input";
import { ExternalLink } from "@/components/ui/external-link";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface CreateBeaconNodeFormProps {
  images: Clients;
  executionClients: ExecutionClientNode[];
  secrets: OptionType[];
}

export const CreateBeaconNodeForm: React.FC<CreateBeaconNodeFormProps> = ({
  images,
  executionClients,
  secrets,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createBeaconNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/ethereum?tab=beacon-nodes`);
      toast.message("Beacon node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const activeExecutionClients = executionClients
    .filter(({ engine }) => engine)
    .map(({ enginePort, name }) => ({
      label: name,
      value: `http://${name}:${enginePort}`,
    }));

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const client = formData.get("client") as BeaconNodeClients;
    const network = readSelectWithInputValue("network", formData);
    const executionEngineEndpoint = readSelectWithInputValue(
      "executionEngineEndpoint",
      formData
    );
    const checkpointSyncUrl = formData.get("checkpointSyncUrl") as string;
    const jwtSecretName = formData.get("jwtSecretName") as string;

    execute({
      name,
      client,
      network,
      executionEngineEndpoint,
      checkpointSyncUrl,
      jwtSecretName,
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
        options={getSelectItems(BeaconNodeClients)}
        errors={fieldErrors}
      />

      <SelectWithInput
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(BeaconNodeNetworks)}
        errors={fieldErrors}
        otherLabel="Other Network"
      />

      <SelectWithInput
        id="executionEngineEndpoint"
        label="Execution Engine Endpoint"
        placeholder="Select a Node"
        options={activeExecutionClients}
        errors={fieldErrors}
        otherLabel="Use External Node"
        description="Nodes must have activated engine port"
      />

      <Input
        id="checkpointSyncUrl"
        label="Checkpoint Sync URL (Optional)"
        description={
          <p className="text-sm text-foreground/70">
            Checkpoint sync endpoints available{" "}
            <ExternalLink href="https://eth-clients.github.io/checkpoint-sync-endpoints">
              here
            </ExternalLink>
          </p>
        }
      />

      <Select
        id="jwtSecretName"
        label="JWT Secret"
        placeholder="Select a Secret"
        options={secrets}
        errors={fieldErrors}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`,
          title: "Create New JWT Secret",
        }}
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
