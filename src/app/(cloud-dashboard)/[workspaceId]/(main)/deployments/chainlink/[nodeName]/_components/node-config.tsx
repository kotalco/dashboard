"use client";

import { useParams } from "next/navigation";

import { ChainlinkLogging, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import {
  ChainlinkNode,
  ExecutionClientNode,
  OptionType,
  Version,
} from "@/types";
import { Protocol } from "./protocol";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { editChainlinkNode } from "@/actions/edit-chainlink";
import { Database } from "./database";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import {
  getCheckboxValue,
  getResourcesValues,
  readSelectWithInputValue,
} from "@/lib/utils";
import { ExecutionClient } from "./execution-client";
import { Wallet } from "./wallet";
import { Tls } from "./tls";
import { Api } from "./api";
import { AccessControl } from "./access-control";
import { Logging } from "./logging";
import { Resources } from "@/components/shared/deployments/resources";

interface NodeConfigProps {
  node: ChainlinkNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  executionClients: ExecutionClientNode[];
  passwords: OptionType[];
  tlss: OptionType[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  executionClients,
  passwords,
  tlss,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editChainlinkNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const databaseURL = formData.get("databaseURL") as string;
    const ethereumWsEndpoint = readSelectWithInputValue(
      "ethereumWsEndpoint",
      formData
    );
    const ethereumHttpEndpoints = formData.getAll(
      "ethereumHttpEndpoints"
    ) as string[];
    const keystorePasswordSecretName = formData.get(
      "keystorePasswordSecretName"
    ) as string;
    const certSecretName = formData.get("certSecretName") as string;
    const secureCookies = getCheckboxValue(formData, "secureCookies");
    const api = getCheckboxValue(formData, "api");
    const apiCredentials = {
      email: formData.get("apiCredentials.email") as string,
      passwordSecretName: formData.get(
        "apiCredentials.passwordSecretName"
      ) as string,
    };
    const corsDomains = formData.get("corsDomains") as string;
    const logging = formData.get("logging") as ChainlinkLogging;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);
    execute({
      name,
      image,
      databaseURL,
      ethereumHttpEndpoints,
      ethereumWsEndpoint,
      keystorePasswordSecretName,
      certSecretName,
      secureCookies: certSecretName ? secureCookies : false,
      api,
      apiCredentials,
      corsDomains,
      logging,
      cpu,
      cpuLimit,
      memory,
      memoryLimit,
      storage,
      workspaceId,
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

      {/* Database */}
      <Database role={role} errors={fieldErrors} node={node} />

      {/* Execution Client */}
      <ExecutionClient
        role={role}
        errors={fieldErrors}
        node={node}
        executionClients={executionClients}
      />

      {/* Wallet */}
      <Wallet
        role={role}
        errors={fieldErrors}
        node={node}
        passwords={passwords}
      />

      {/* TLS */}
      <Tls role={role} errors={fieldErrors} node={node} tlss={tlss} />

      {/* API */}
      <Api role={role} errors={fieldErrors} node={node} passwords={passwords} />

      {/* Access Control */}
      <AccessControl role={role} errors={fieldErrors} node={node} />

      {/* Logs */}
      <Logging role={role} errors={fieldErrors} node={node} />

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
