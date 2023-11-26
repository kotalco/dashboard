"use client";

import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/form/input";
import { ChainlinkNetworks, SecretType } from "@/enums";
import { Select } from "@/components/form/select";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, Version } from "@/types";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/use-action";
import { createChainlink } from "@/actions/create-chainlink";
import { toast } from "sonner";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { ExternalLink } from "@/components/ui/external-link";
import { SelectWithInput } from "@/components/form/select-with-input";

interface CreateChainlinkNodeFormProps {
  images: Version[];
  executionClients: ExecutionClientNode[];
  passwords: { label: string; value: string }[];
}

export const CreateChainlinkNodeForm: React.FC<
  CreateChainlinkNodeFormProps
> = ({ images, executionClients, passwords }) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createChainlink, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/chainlink`);
      toast.message("Chainlink node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });
  const activeExecutionClients = executionClients
    .filter(({ ws }) => ws)
    .map(({ name, wsPort }) => ({
      label: name,
      value: `ws://${name}:${wsPort}`,
    }));

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const evmChain = formData.get("evmChain") as ChainlinkNetworks;
    const ethereumWsEndpointSelect = formData.get(
      "ethereumWsEndpoint-select"
    ) as string;
    const ethereumWsEndpointInput = formData.get(
      "ethereumWsEndpoint-input"
    ) as string;
    const ethereumWsEndpoint =
      ethereumWsEndpointSelect !== "other"
        ? ethereumWsEndpointSelect
        : ethereumWsEndpointInput;
    const databaseURL = formData.get("databaseURL") as string;
    const keystorePasswordSecretName = formData.get(
      "keystorePasswordSecretName"
    ) as string;
    const apiCredentials = {
      email: formData.get("apiCredentials.email") as string,
      passwordSecretName: formData.get(
        "apiCredentials.passwordSecretName"
      ) as string,
    };

    execute({
      name,
      evmChain,
      ethereumWsEndpoint,
      databaseURL,
      keystorePasswordSecretName,
      apiCredentials,
      workspace_id: workspaceId as string,
      image: images[0].image,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-sm space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="evmChain"
        label="EVM Chain"
        errors={fieldErrors}
        placeholder="Select a chain"
        options={getSelectItems(ChainlinkNetworks)}
      />

      <p className="text-sm font-medium leading-none space-y-1">
        <span>Client: </span>
        <ExternalLink href="https://github.com/smartcontractkit/chainlink">
          Chainlink
        </ExternalLink>
      </p>

      <SelectWithInput
        id="ethereumWsEndpoint"
        label="Ethereum Websocket Endpoint"
        placeholder="Select an Execution Client"
        options={activeExecutionClients}
        otherLabel="Externally Managed Node"
        description="Execution client nodes with WebSocket enabled"
        errors={fieldErrors}
      />

      <Input
        id="databaseURL"
        label="Database Connection URL"
        placeholder="postgress://"
        errors={fieldErrors}
      />

      <Select
        id="keystorePasswordSecretName"
        label="Keystore Password"
        placeholder="Select a password"
        options={passwords}
        errors={fieldErrors}
        link={{
          title: "Create New Password",
          href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
        }}
        description="For securing access to chainlink wallet"
      />

      <div className="space-y-4">
        <div>
          <Label className="text-xl">API Credentials</Label>
          <p className="text-sm text-muted-foreground">
            For securing access to chainlink dashboard
          </p>
        </div>

        <Input id="apiCredentials.email" label="Email" errors={fieldErrors} />

        <Select
          id="apiCredentials.passwordSecretName"
          label="Password"
          placeholder="Select a password"
          options={passwords}
          errors={fieldErrors}
          link={{
            title: "Create New Password",
            href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
          }}
          description="For securing access to chainlink wallet"
        />
      </div>

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
