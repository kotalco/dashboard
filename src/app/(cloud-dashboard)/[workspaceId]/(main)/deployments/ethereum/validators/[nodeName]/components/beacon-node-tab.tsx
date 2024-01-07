"use client";

import { useParams } from "next/navigation";

import { BeaconNode, ValidatorNode } from "@/types";
import { BeaconNodeClients, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editBeaconNode } from "@/actions/edit-validator";

import { MultiSelect } from "@/components/form/multi-select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface BeaconNodeTabProps {
  node: ValidatorNode;
  role: Roles;
  beaconNodes: BeaconNode[];
}

export const BeaconNodeTab: React.FC<BeaconNodeTabProps> = ({
  node,
  role,
  beaconNodes,
}) => {
  const { beaconEndpoints, client, name } = node;
  const { workspaceId } = useParams();

  const { execute, fieldErrors, error, success } = useAction(editBeaconNode);

  const activeBeaconNods = beaconNodes
    .filter(({ client, rest, rpc }) =>
      client === BeaconNodeClients["ConsenSys Teku"] ||
      client === BeaconNodeClients["Sigma Prime Lighthouse"]
        ? rest
        : rpc
    )
    .map(({ name, client, rpcPort, restPort }) => ({
      label: name,
      value: `http://${name}:${
        client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"]
          ? restPort
          : rpcPort
      }`,
    }));

  const onSubmit = (formData: FormData) => {
    const beaconEndpoints = formData.getAll("beaconEndpoints") as [
      string,
      ...string[]
    ];
    execute(
      { beaconEndpoints, client },
      { name: name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <MultiSelect
        id="beaconEndpoints"
        label="Beacon Node Endpoints"
        disabled={role === Roles.Reader}
        defaultValue={beaconEndpoints}
        placeholder="Select beacon nodes"
        options={activeBeaconNods}
        className="max-w-sm"
        errors={fieldErrors}
        allowCustomValues
      />

      <SubmitSuccess success={success}>
        Beacon node endpoints settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
