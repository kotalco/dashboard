"use client";

import { editAptosNode } from "@/actions/edit-aptos";
import { InputWithUnit } from "@/components/form/input-with-unit";
import { Select } from "@/components/form/select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Toggle } from "@/components/form/toggle";
import { Alert } from "@/components/ui/alert";
import { ExternalLink } from "@/components/ui/external-link";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AptosNetworks, Roles, StorageUnits } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { getEnumKey, getSelectItems } from "@/lib/utils";
import { AptosNode, Version } from "@/types";
import { useParams } from "next/navigation";
import { useState } from "react";

interface NodeConfigProps {
  node: AptosNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
}

export const NodeConfig = ({ node, role, versions }: NodeConfigProps) => {
  const { workspaceId } = useParams();
  const [currentImage, setCurrentImage] = useState(node.image);

  const { execute, fieldErrors, error, success } = useAction(editAptosNode);

  const onSubmit = (formData: FormData) => {
    const api = formData.get("api") === "on";
    execute({ api }, { name: node.name, workspaceId: workspaceId as string });
  };

  const options = versions.map(({ name, image, disabled }) => ({
    label: name.toUpperCase(),
    value: image,
    disabled,
  }));

  return (
    <form action={onSubmit} className="space-y-8">
      {/* Protocol */}
      <div className="space-y-4">
        <Heading variant="h2" title="Protocol" />
        {/* <Separator className="max-w-xs" /> */}
        <ul className="flex justify-between items-center mt-4 max-w-md">
          <li className="flex flex-col">
            <span className="font-semibold  leading-none">Protocol</span>
            <span className="text-foreground/50">Aptos</span>
          </li>
          <Separator orientation="vertical" className="h-10" />

          <li className="flex flex-col">
            <span className="font-semibold  leading-none">Network</span>
            <span className="text-foreground/50">
              {getEnumKey(AptosNetworks, node.network)}
            </span>
          </li>
          <Separator orientation="vertical" className="h-10" />

          <li className="flex flex-col">
            <span className="font-semibold  leading-none">Client</span>
            <ExternalLink href="https://github.com/aptos-labs/aptos-core">
              Aptos Core
            </ExternalLink>
          </li>
        </ul>
        <div>
          <Select
            id="image"
            label="Client Version"
            disabled={role === Roles.Reader}
            defaultValue={node.image}
            onValueChange={setCurrentImage}
            description="Latest version is recommended"
            options={options}
            className="max-w-xs"
            errors={fieldErrors}
          />
          <ExternalLink
            href={
              versions.find((version) => version.image === currentImage)
                ?.releaseNotes!
            }
          >
            Release Notes
          </ExternalLink>
        </div>

        {versions?.find((version) => version.image === node.image)
          ?.canBeUpgraded && (
          <Alert className="alert-info">
            New image version is avaliable. It is recommended to update to
            latest version.
          </Alert>
        )}
      </div>

      <Separator className="max-w-sm" />

      {/* API */}
      <div className="space-y-4">
        <Heading variant="h2" title="API" />
        <Toggle
          id="api"
          label="REST"
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          defaultChecked={node.api}
        />
      </div>
      <Separator className="max-w-sm" />

      {/* Resources */}
      <div className="space-y-4 max-w-xs">
        <Heading variant="h2" title="Resources" />
        <InputWithUnit
          label="CPU Cores Required"
          disabled={role === Roles.Reader}
          unit="Core"
          defaultValue={node.cpu}
          errors={fieldErrors}
          id="cpu"
        />

        <InputWithUnit
          label="Maximum CPU Cores"
          disabled={role === Roles.Reader}
          unit="Core"
          defaultValue={node.cpuLimit}
          errors={fieldErrors}
          id="cpuLimit"
        />

        <InputWithUnit
          label="Memory Required"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={node.memory}
          errors={fieldErrors}
          id="memory"
        />

        <InputWithUnit
          label="MAX Memory"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={node.memoryLimit}
          errors={fieldErrors}
          id="memoryLimit"
        />

        <InputWithUnit
          label="Disk Space Required"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={node.storage}
          errors={fieldErrors}
          id="storage"
        />
      </div>

      <SubmitSuccess success={success}>
        Your node configrations have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <SubmitButton data-testid="submit" type="submit">
          Update
        </SubmitButton>
      )}
    </form>
  );
};